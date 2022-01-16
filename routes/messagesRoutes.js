const { sequelize, Messages} = require('../models');
const express = require('express');
const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));
const {messageSchema} = require('../validation_schema');

// Get messages
route.get('/', (req, res) => {
    Messages.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});
// Get specific message
route.get('/:id', (req, res) => {
    Messages.findOne({ where: { id: req.params.id } })
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

// Get users message
route.get('/user/:id', (req, res) => {
    console.log("gadjao me jeesste ");
    Messages.findOne({ where: { id: req.params.id } })
        .then( rows => {
            console.log("printam ovo")
            console.log(rows);
            res.json(rows)
        } )
        .catch( err => {
            console.log("eror");
            res.status(500).json(err) 
        });
});

// Create message
route.post('/', (req, res) => {
    messageSchema.validateAsync(req.body).then(obj => {
        Messages.create(obj).then(row =>{
            console.log("Message succesfully created!");
            res.json(row);
        }).catch(err => res.status(500).json(err));
    }).catch(err => res.status(600).json(err));  
});

// Edit message
route.put("/:id", (req, res) => {
    messageSchema.validateAsync(req.body).then(obj => {
        Messages.findOne({ where: { id: req.params.id }}).then(messages =>{
            messages.body = req.body.body;
            messages.userId = req.body.userId;
            messages.save();
            res.json(messages);
        }).catch(err => res.status(500).json(err));
    }).catch(err => res.status(600).json(err)); 
});

// Delete book
route.delete('/:id', (req, res) => {
    Messages.findOne({ where: { id: req.params.id }}).then(messages =>{
        messages.destroy();
        res.json(messages);
    }).catch(err => res.status(500).json(err));
});

module.exports = route;