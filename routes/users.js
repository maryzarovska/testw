var express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var router = express.Router();

const cloudinary = require('cloudinary').v2;

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const users = require('../services/users');
const config = require('../config');
require('../config/passport-config')(passport, users.getByUsername, users.insertOne);

router.post('/signup', (req, res, next) => {
  passport.authenticate('local-signup', (err, user, info) => {
    if (err) {
      res.status(500).json({ message: 'Server error!' });
    } else {
      res.status(200).json(info);
    }
  })(req, res, next);
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
  res.send({imagePath: req.file.path});
});

router.put('/update-profile-info', passport.authenticate('jwt', { session: false }), async (req, res) => {
  let user = await users.getByUsername(req.user.username);
  if (user) {
    await users.updateUser(user.id, req.body.username, req.body.name);
    res.sendStatus(200);
  }
  else 
    res.sendStatus(400);
})

module.exports = router;
