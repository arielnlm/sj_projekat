const { sequelize, Events} = require('../models');
const express = require('express');
const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));
const {eventSchema} = require('../validation_schema');

// Get events
route.get('/', (req, res) => {
    Events.findAll()
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

// Get one event
route.get('/:id', (req, res) => {
    Events.findOne({ where: { id: req.params.id }} )
        .then( rows => res.json(rows) )
        .catch( err => res.status(500).json(err) );
});

// Create events
route.post('/', (req, res) => {
    eventSchema.validateAsync(req.body).then(obj => {
       obj = req.body;
        Events.create(obj).then(row =>{
            console.log("Event succesfully created!");
            res.json(row);
        }).catch(err => res.status(500).json(err));
    }).catch(err => res.status(600).json(err));  
});

// Edit events
route.put("/:id", (req, res) => {
    eventSchema.validateAsync(req.body).then(obj => {
        Events.findOne({ where: { id: req.params.id }}).then(event =>{
            event.name = req.body.name;
            event.description = req.body.description;
            event.date = req.body.date;
            event.time = req.body.time;
            event.host = req.body.host;
            event.guests = req.body.guests;
            event.save();
            res.json(event);
        }).catch(err => res.status(500).json(err));
    }).catch(err => res.status(600).json(err)); 
});


// One more person coming
route.get("/coming/:id", (req, res) => {
    Events.findOne({ where: { id: req.params.id }}).then(event =>{
        event.guests = event.guests + 1;
        event.save();
        res.json(event);
    }).catch(err => res.status(500).json(err));
});

// Delete events
route.delete('/:id', (req, res) => {
    Events.findOne({ where: { id: req.params.id }}).then(event =>{
        event.destroy();
        res.json(event);
    }).catch(err => res.status(500).json(err));
});

module.exports = route;