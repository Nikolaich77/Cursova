const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 8000;

app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/static'));


var users = []

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/kanban', (req, res) => {
    res.sendFile(__dirname + '/public/kanban.html');
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
});

app.post('/login/signin', (req, res) => {
    try {
        var hash = crypto.createHash('sha1').update(req.body.email + req.body.password).digest('hex');
        if (users.find(user => user.uid === hash)) {
            res.status(200).send(hash);
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/login/signup', (req, res) => {
    try {
        var hash = crypto.createHash('sha1').update(req.body.email + req.body.password).digest('hex');
        if (users.find(user => user.uid === hash)) {
            res.sendStatus(409);
        } else {
            console.log('register : ' + hash);
            users.push({uid : hash, name : req.body.name, email : req.body.email, notes : []});
            res.status(200).send(hash);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/:userID/notes', (req, res) => {
    res.send(users.find(user => user.uid === req.params.userID).notes);
});

app.put('/:userID/notes/:noteId', (req, res) => {
    try {
        users.find(user => user.uid === req.params.userID).notes[req.params.noteId] = req.body;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userID/notes/:noteId/change_status', (req, res) => {
    try {
        users.find(user => user.uid === req.params.userID).notes[req.params.noteId].position = req.body.position;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userID/notes/:noteId/update', (req, res) => {
    try {
        users.find(user => user.uid === req.params.userID).notes[req.params.noteId].text = req.body.text;
        users.find(user => user.uid === req.params.userID).notes[req.params.noteId].color = req.body.color;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.post('/:userID/notes', (req, res) => {
    try {
        users.find(user => user.uid === req.params.userID).notes.push(req.body);
        res.status(200).send(JSON.stringify(users.find(user => user.uid === req.params.userID).notes.length - 1));
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.delete('/:userID/notes/:noteId', (req, res) => {
    try {
        users.find(user => user.uid === req.params.userID).notes.splice(req.params.noteId, 1);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.listen(port);