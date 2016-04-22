'use strict';

var fs = require('fs');
var path = require('path');
var moment = require('moment');

var dataFile = path.join(__dirname, '../data/messages.json');

exports.findAll = function(cb) {
    fs.readFile(dataFile, (err, data) => {
        if (err) {
            cb(err);
            return;
        }

        try {
            var messages = JSON.parse(data);
        } catch (err) {
            return cb(err);
        }

        messages.reverse();

        cb(null, messages);
    })
};

exports.create = function(message, cb) {
    if (!message.message || !message.name || !message.email) {
        return cb('A message, your name, and your email are required.');
    }

    this.findAll((err, messages) => {
        if (err) {
            return cb(err);
        }

        var newMessage = {
            message: message.message,
            name: message.name,
            email: message.email,
            image: message.image,
            timestamp: message.timestamp,
            id: message.id
        };

        messages.push(newMessage);

        fs.writeFile(dataFile, JSON.stringify(messages), err => {
            cb(err);
        });
    });
};

exports.findById = function(id, cb) {
    if (!id) return cb('Message id required.');

    this.findAll((err, messages) => {
        if (err) return cb(err);

        var message = messages.filter(message => message.id === id)[0];

        cb(null, message);
    });
};

exports.removeById = function(id, cb) {
    if (!id) return cb('Message id required.');
    
    this.findAll((err, messages) => {
        if (err) return cb(err);
        
        messages = messages.filter(message => message.id !== id);

        fs.writeFile(dataFile, JSON.stringify(messages), err => {
            cb(err);
        });
    });
};

exports.updateById = function(id, newMessage, cb) {
    if (!id) return cb('Message id required.');

    if (!newMessage.message || !newMessage.name || !newMessage.email) {
        return cb('A message, your name, and your email are required.');
    }

    this.findAll((err, messages) => {
        messages = messages.map(message => {
            if (message.id === id) {
                return newMessage;
            }

            return message;
        });

        fs.writeFile(dataFile, JSON.stringify(messages), err => {
            cb(err);
        });
    });
};