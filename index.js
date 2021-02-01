const express = require('express');
const { response } = express;
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const db = require('./db');
db.initialise(mongoose);

//app.set('view engine', 'pug')

app.get('/stylesheet', (req, res) => {
    res.sendFile(path.join(__dirname + '/css/styles.css'));
});

app.get('/bodyscript', (req, res) => {
    res.sendFile(path.join(__dirname + '/js/body.js'));
})

app.get('/jquery', (req, res) => {
    res.sendFile(path.join(__dirname + '/js/jquery-3.5.1.min.js'));
});

app.get('/chartjs', (req, res) => {
    res.sendFile(path.join(__dirname + '/js/Chart.bundle.min.js'));
});


/**
 * Get Data from the backend
 * Request Parameters:
 * TimeFrom = Optional String; MMYY, Ex: 0818; Default - From beginning
 * TimeTo = Optional String; MMYY, Ex: 0919; Default - Last data.
 * Locations = Optional List of String; Ex: ATM,Sabu's; Default - All.
 * 
 * Response Paramters:
 * [ {
 *      Location=XX,
 *      Time=MMYY,
 *      Unit=XXX
 *   }, { ... }
 * ]
 */
app.post('/api/data/get', (req, res) => {

});

app.post('/api/data/set', (req, res) => {
    res.sendStatus(200);
});



module.exports = app;