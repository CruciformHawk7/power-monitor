const express = require('express');
const cors = require('cors');
const { response } = express;
const crypto = require('crypto');
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
 * Response:
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

app.get('/api/data/get', async(req, res) => {
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

/**
 * Set Data to backend.
 * Request Parameters:
 * Password: The Password.
 * Date: Date when reading was taken.
 * Location: Site where the reading was taken.
 * UnitsConsumed: How many units the reading is.
 * 
 * Response:
 * 200 (OK) if everything went fine.
 * 400 (Bad Request) if anything goes wrong.
 * 401 (Unauthorised) if incorrect password.
 */

app.post('/api/data/set', async(req, res) => {
    if (req.query["Password"] == null || req.query["Date"] == null ||
        req.query["Location"] == null || req.query["UnitsConsumed"] == null) {
        res.sendStatus(400);
    } else {
        var hash = req.query["Password"];
        var hashed = crypto.createHash('md5').update(hash).digest('hex');
        var date = new Date(req.query["Date"]);
        location = req.query["Location"];
        var result = await db.setData(hashed, date, location, parseInt(req.query["UnitsConsumed"]));
        if (result) {
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    }
});

/**
 * Sends a plain array of all locations.
 * Request Parameters:
 * None
 * 
 * Response:
 * [ "aa", "bb", ...]
 */
app.get('/api/locations/get', async(req, res) => {
    var data = await db.getLocs();
    var r = [];
    data.forEach(e => {
        r.push(e.location);
    });
    res.send(r);
});

module.exports = app;