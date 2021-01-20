const { response } = require('express');
const express = require('express')
const app = express()
const path = require('path');
const port = 8080

app.set('view engine', 'pug')

app.get('/PugTest', (req, res) => {
    res.render('main', { Hello: "Hi" })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/main.html'));
});

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

app.post('/api/v1/getData', (req, res) => {
    var range, type;
    range = (req.query.Range == null) ? 7 : req.query['Range'];
    type = (req.query.Type == null) ? 'days' : req.query['Type'];
    if (req.query.Type.toLowerCase() != 'days' || req.query.Type.toLowerCase() != 'weeks' || req.query.Type.toLowerCase() != 'months') {
        type = 'days';
    }
    let data = { Range: range, Type: type };
    res.send(data);
});

app.listen(port);