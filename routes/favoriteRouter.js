const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');
const Users = require('../models/users');
const Favorites = require('../models/favorites');

favoriteRouter.use(bodyParser.json()); 

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Users.findById(req.user._id)
    .then((user) => {
        if(user.favorites == undefined) {
            Favorites.create({ user: req.user._id })
            .then((favorites) => {
                for(i = 0; i < req.body.length; ++i) 
                    favorites.dishes.push(req.body[i]._id);

                favorites.save()
                .then((favorites) => {
                    user.favorites = favorites._id;
                    user.save()
                    .then((user) => console.log(user), (err) => next(err));

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                for(i = 0; i < req.body.length; ++i) 
                    if(favorites.dishes.includes(req.body[i]._id))
                        continue;
                    else
                        favorites.dishes.push(req.body[i]._id);

                favorites.save()
                .then((favorites) => {
                    user.favorites = favorites._id;
                    user.save()
                    .then((user) => console.log(user), (err) => next(err));

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ user: req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));

    Users.findByIdAndUpdate({ _id: req.user._id} , { favorites: undefined })
    .then((user) => {
        console.log(user);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Users.findById(req.user._id)
    .then((user) => {
        if(user.favorites == undefined) {
            Favorites.create({user: req.user._id})
            .then((favorites) => {
                favorites.dishes.push(req.params.dishId);
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                }, (err) => next(err))

                user.favorites =  favorites._id;
                user.save()
                .then((user) => {
                    console.log(user);
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            Favorites.findOne({ user: user._id })
            .then((favorites) => {
                if(favorites.dishes.includes(req.params.dishId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    
                    const err = new Error('Dish is already in favorites!');
                    next(err);
                }
                else {
                    favorites.dishes.push(req.params.dishId);
                    favorites.save()
                    .then((favorites) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorites);
                    }, (err) => next(err));
                }
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((favorites) => {
        if(!favorites.dishes.includes(req.params.dishId)) {
            const err = new Error('Dish is already not in your favorites!');
            next(err);
        }
        else {
            favorites.dishes = favorites.dishes.filter((dishId) => dishId != req.params.dishId);
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

module.exports = favoriteRouter;