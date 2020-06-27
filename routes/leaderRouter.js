const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, next) => {
    res.end('Will bring you all the leaders');
}).post((req, res, next) => {
    res.end('Will add the Leader: ' + req.body.name + ' with details: ' + req.body.description);
}).put((req, res, end) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
}).delete((req, res, next) => {
    res.end('Deleting all the Leaders');
});

leaderRouter.route('/:leaderId').all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
}).get((req, res, next) => {
    res.end('Will bring leader: ' + req.params.leaderId);
}).post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation is not supported on /leaders/' + req.params.leaderId);
}).put((req, res, end) => {
   res.write('Updating the leaders: ' + req.params.leaderId + '\n');
   res.end('Will update the leader ' + req.body.name + ' with details ' + req.body.description);
}).delete((req, res, next) => {
    res.end('Deleting leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;