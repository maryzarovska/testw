var express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'f0d42ede19316b',
    pass: '91e1ed16e10137'
  }
});

var router = express.Router();

const cloudinary = require('cloudinary').v2;

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const users = require('../services/users');
const config = require('../config');
require('../config/passport-config')(passport, users.getByUsername, users.insertOne);

router.post('/signup', async (req, res, next) => {
  if (await users.checkEmailAvailability(req.body.email)) {
    passport.authenticate('local-signup', async (err, user, info) => {
      if (err) {
        res.status(500).json({ message: 'Server error!' });
      } else {
        console.log(req.body, req.user)
        if (info.success) {
          await users.setEmailByUsername(req.body.username, req.body.email);
        }
        res.status(200).json(info);
      }
    })(req, res, next);
  } else {
    res.status(200).json({ success: false, message: 'This email is already in use!' });
  }
})

router.post('/signin', async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        const error = new Error('An error occurred.');
        return next(error);
      }
      if (!user) {
        return res.json({ message: 'Invalid username or password!' })
      }
      req.login(
        user, { session: false },
        async (error) => {
          if (error) {
            return next(error);
          }
          const userData = { id: user.id, username: user.username };
          const token = jwt.sign({ user: userData }, config.jwtSecret);

          return res.json({ token, userData });
        }
      );
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: await users.getByUsername(req.user.username)
  });
});

router.get('/profile/:username', async (req, res, next) => {
  res.json(
    await users.getUserData(req.params.username)
  )
})

router.post('/upload-profile-image', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  let user = await users.getByUsername(req.user.username);
  console.log(req.file);
  if (user && user.image_path) {
    let temp = user.image_path.split('/');
    let resName = 'testw/' + temp[temp.length - 1].split('.')[0];
    let delResult = await cloudinary.api.delete_resources([resName]);
    console.log(delResult);
  }
  users.updateImage(user.id, req.file.path);
  res.send({ imagePath: req.file.path });
});

router.put('/update-profile-info', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let user = await users.getByUsername(req.user.username);
  if (user) {
    users.updateUser(user.id, req.body.username, req.body.name, req.body.email).then(data => {
      console.log(data);
      const userData = { id: user.id, username: req.body.username };
      const token = jwt.sign({ user: userData }, config.jwtSecret);
      res.status(200).send({ token, userData });
    }).catch(err => {
      console.log(err);
      res.status(400).send({ message: 'This username is already taken!' });
    });
  }
  else
    res.sendStatus(400);
});

router.get('/send-reset-password', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  let user = await users.getByUsername(req.user.username);
  if (user) {
    let result = await users.createQueryToResetPassword(user.id);
    console.log(user);
    const mailOptions = {
      from: 'The Idea project',
      to: `${user.email}`,
      subject: 'Password Reset',
      html: `
      <!DOCTYPE html>
      <html>

        <head>
          <title>Reset password</title>
        </head>

        <body>
          <p>Click below to reset your password</p>
          <br>
          <p>
            <a href="http://localhost:3000/reset-password/${result}">CLICK HERE</a>
          </p>
        </body>

      </html>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Cannot send an email, error: ');
        console.log(err);
      } else if (info) {
        console.log('Info: ')
        console.log(info);
      }
    });
    res.sendStatus(200);
  }
});

router.get('/reset-code-check/:resetCode', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  console.log(req.params.resetCode);
  let validationResult = await users.validateResetPasswordCode(req.params.resetCode);
  res.send(validationResult);
});

router.post('/set-new-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  await users.setPassword(req.body.userId, hashedPassword);
  res.sendStatus(200);
});

router.get('/get-subscriptions/:id',passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.send(await users.getUserSubscriptions(req.params.id ));
});

module.exports = router;
