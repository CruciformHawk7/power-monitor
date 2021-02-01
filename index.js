const express = require('express');
const cors = require('cors');
const { response } = express;
const app = express();
const mongoose = require('mongoose');
const db = require('./db');
db.initialise(mongoose);


app.use(cors());
//app.set('view engine', 'pug')

/**
 * Get Data from the backend
 * Request Parameters:
 * TimeFrom = Optional String; MMYYYY, Ex: 082018; Default - From beginning
 * TimeTo = Optional String; MMYY, Ex: 092019; Default - Last data.
 * Locations = Optional List of String; Ex: ATM,Sabu%27s; Default - All; URL Encoding is required
 * 
 * Response Paramters:
 * [ {
 *      Location=XX,
 *      Date=ISO Formatted Date,
 *      Unit=XXX
 *   }, { ... }
 * ]
 */
app.post('/api/data/get', async(req, res) => {
    var from, to, locations;
    if (req.query['TimeFrom'] == null) {
        from = new Date(Date.UTC(2017, 7, 1));
    } else {
        let m = req.query['TimeFrom'].slice(0, 2);
        let y = req.query['TimeFrom'].slice(2, 6);
        from = new Date(Date.UTC(parseInt(y), (parseInt(m) - 1), 1));
    }
    if (req.query['TimeTo'] == null) {
        to = new Date();
    } else {
        let m = req.query['TimeTo'].slice(0, 2);
        let y = req.query['TimeTo'].slice(2, 6);
        to = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, 1));
    }
    if (req.query['Locations'] == null || req.query['Locations'] == '') {
        locations = null;
    } else {
        locations = req.query['Locations'].split(',');
    }
    if (to < from) {
        res.sendStatus(400);
    } else {
        var resp = await db.getData(from, to, locations);
        res.setHeader('Content-Type', 'application/json');
        res.send(resp);
    }
});

app.post('/api/data/set', (req, res) => {
    res.sendStatus(200);
});

module.exports = app;