var express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const { route } = require('.');
var router = express.Router();
router.use(bodyParser.json());

const mongoose = require('mongoose');
const User = require('../models/users');
const authenticate = require('../authenticate');
const cors = require('./cors');

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => res.sendStatus(200))
router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
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

router.post('/signup', cors.corsWithOptions,  (req, res, next) => {
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

router.post('/login', cors.corsWithOptions, (req, res, next) => {
  
  passport.authenticate('local', (err, user, info) => {
    if(err) 
      return next(err);

    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'Login unsuccessfull!', success: false, err: info});
    }

    req.logIn(user, (err) => {
      if(err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Login unsuccessfull!', success: false, err: 'Could not login user'});
      }

      const token = authenticate.getToken({_id: req.user._id});
    
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({status: 'Login Successfull!', success: true, token: token});
    });
  }) (req, res, next);
});

router.get('/logout', cors.corsWithOptions, (req, res, next) => {
  if(req.session) {
    req.session.destroy();
    res.statusCode = 200;
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    const err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if(req.user) {
    const token = authenticate.getToken({ id: req.user._id });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({token: token, status: 'You are successfully logged in!', success: true});
  }
});

router.get('/checkJWTToken', cors.corsWithOptions, (req, res, next) => {
  passport.authenticate('jwt', {session: false}, (err, user) => {
    if(err) 
      return next(err);
    
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT Invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT Valid!', success: true, user: user});
    }
  }) (req, res, next);
})

module.exports = router;
