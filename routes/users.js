var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { route } = require('.');
var router = express.Router();
router.use(bodyParser.json());

const mongoose = require('mongoose');
const User = require('../models/users');
const authenticate = require('../authenticate');

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
  User.find()
  .then((users) => {
    if(users != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(users);

      return;
    }

    const err = new Error('There are no registers users found');
    err.status = 404;

    return next(err);
  })
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      res.stausCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstName) user.firstName = req.body.firstName;
      if(req.body.lastName) user.lastName = req.body.lastName;

      user.save((err, user) => {
        if(err) {
          res.stausCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});

          return;
        }

        passport.authenticate('Local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({status: 'Registration Successful!', success: true});
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'You are successfully logged in!', success: true, token: token});
});

router.get('/logout', (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
