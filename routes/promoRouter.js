const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, next) => {
    res.end('Will bring you all the promotions');
}).post((req, res, next) => {
    res.end('Will add the Promotion: ' + req.body.name + ' with details: ' + req.body.description);
}).put((req, res, end) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
}).delete((req, res, next) => {
    res.end('Deleting all the promotions');
});

promoRouter.route('/:promoId').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, next) => {
    res.end('Will bring promotion: ' + req.params.promoId);
}).post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /promotions/' + req.params.promoId);
}).put((req, res, end) => {
   res.write('Updating the promotion: ' + req.params.promoId + '\n');
   res.end('Will update the promotion ' + req.body.name + ' with details ' + req.body.description);
}).delete((req, res, next) => {
    res.end('Deleting promotion: ' + req.params.promoId);
});

module.exports = promoRouter;