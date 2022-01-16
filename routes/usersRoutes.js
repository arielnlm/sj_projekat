const { sequelize, Users} = require('../models');
const {userSchema} = require('../validation_schema');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const e = require('express');
const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

function getCookies(req) {
    if (req.headers.cookie == null) return {};

    const rawCookies = req.headers.cookie.split('; ');
    const parsedCookies = {};

    rawCookies.forEach( rawCookie => {
        const parsedCookie = rawCookie.split('=');
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });

    return parsedCookies;
};

function isAdmin(req){
    console.log(req.headers);
    let token = req.headers['authorization'];
    if(token == undefined)
        return false;
    token = token.split(' ')[1];
    if(token == undefined)
        return false;
    
    return jwt.decode(token).admin;
}

//Get all users
route.get('/', (req, res) => {
        Users.findAll()
        .then( rows => {
            rows.password
            res.json(rows)
        } )
        .catch( err => res.status(550).json(err) );
});

//Get one user
route.get('/:id', (req, res) => {
        Users.findOne({where: {id: req.params.id}})
        .then( rows =>{
            res.json(rows);
        })
        .catch( err => res.status(550).json(err) );
});

//Get user by name
route.get('/name/:name', (req, res) => {
    Users.findOne({where: {name: req.params.name}})
    .then( rows => res.json(rows) )
    .catch( err => res.status(550).json(err) );
});

// Create user
route.post('/', (req, res) => {
    if(isAdmin(req) == false){
        res.status(403).json(err);
        return;
    }
    userSchema.validateAsync(req.body).then(obj => {
        console.log(obj.email);
    obj = req.body;
    obj.password = bcrypt.hashSync(req.body.password, 10);
    console.log(obj.password);
        Users.create(obj).then(row =>{
            console.log("User succesfully created!");
            res.json(row);
        }).catch(err => res.status(500).json(err));

    }).catch(err => res.status(600).json(err));    
});

// Create user
route.post('/register', (req, res) => {
    userSchema.validateAsync(req.body).then(obj => {
    obj = req.body;
    console.log(obj.email);
    obj.password = bcrypt.hashSync(req.body.password, 10);
    console.log(obj.password);
        Users.create(obj).then(row =>{
            console.log("User succesfully created!");
            res.json(row);
        }).catch(err => res.status(500).json(err));

    }).catch(err => res.status(600).json(err));    
});

// Edit user
route.put("/:id", (req, res) => {
    if(isAdmin(req) == false){
        res.status(403).json(err);
        return;
    }
    userSchema.validateAsync(req.body).then(obj => {
        Users.findOne({ where: { id: req.params.id }}).then(usr =>{
            usr.name = req.body.name;
            usr.email = req.body.email;
            usr.password = bcrypt.hashSync(req.body.password, 10);
            usr.mod = req.body.mod;
            usr.admin = req.body.admin;
            usr.save();
            res.json(usr);
        }).catch(err => res.status(500).json(err));
    }).catch(err => res.status(600).json(err));   
});

// Delete user
route.delete('/:id', (req, res) => {
    if(isAdmin(req) == false){
        res.status(403).json(err);
        return;
    }
    Users.findOne({ where: {  id: req.params.id }}).then(usr =>{
        usr.destroy();
        res.json(usr);
    }).catch(err => res.status(500).json(err));

});

module.exports = route;