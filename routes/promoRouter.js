const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Promos = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req, res, next) => {
    Promos.find({})
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    },(err) => next(err))
    .catch((err) => next(err));
}).post((req, res, next) => {
    Promos.create(req.body)
    .then((promo) => {
        console.log('Promotion created ', promo);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application-json');
        res.json(promo);
    }, (err) => next(err))
    .catch((err) => next(err));
}).put((req, res, end) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
}).delete((req, res, next) => {
    Promos.deleteMany()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

promoRouter.route('/:promoId')
.get((req, res, next) => {
    Promos.findById(req.params.promoId)
    .then((promo) => {
        if(promo != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promo);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}).post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /promotions/' + req.params.promoId);
}).put((req, res, end) => {
   Promos.findByIdAndUpdate(req.params.promoId, {
       $set: req.body
   }, {
       new: true
   })
   .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
   }, (err) => next(err))
   .catch((err) => next(err));

}).delete((req, res, next) => {
    Promos.findByIdAndDelete(req.params.promoId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;