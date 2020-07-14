var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { route } = require('.');
var router = express.Router();
router.use(bodyParser.json());

const mongoose = require('mongoose');
const User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
    if(err) {
      res.stausCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      passport.authenticate('Local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registration Successful!', success: true});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({status: 'You are successfully logged in!', success: true});
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
