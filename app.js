'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var Message = require('./models/message');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'jade');

app.route('/api/messages').get((req, res, next) => {
    Message.findAll((err, messages) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.send(messages);
    });
}).post((req, res, next) => {
    Message.create(req.body, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

app.route('/api/messages/:id').get((req, res, next) => {
    var id = req.params.id;

    Message.findById(id, (err, message) => {
        if (err || !message) {
            return res.status(400).send(err || 'Message not found.');
        }

        res.send(message);
    });
}).put((req, res, next) => {
    var id = req.params.id;
    
    Message.updateById(id, req.body, err => {
        res.send();
    });
}).delete((req, res, next) => {
    var id = req.params.id;

    Message.removeById(id, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

app.get('/', (req, res, next) => {
    res.render('index', {
        indexRoute: true
    });
});

app.get('/messages', (req, res, next) => {
    Message.findAll((err, messages) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.render('messages', {
            messagesRoute: true,
            messages: messages
        });
    });
});

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});