var express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
var router = express.Router();

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

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    message: 'You made it to the secure route',
    user: req.user
  });
});

router.get('/profile/:username', async (req, res, next) => {
  res.json(
    await users.getUserData(req.params.username)
  )
})

module.exports = router;
