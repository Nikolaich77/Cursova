const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());

var users = [{username : 'user1', notes : []}, {username : 'user2', notes : []}]

app.get('/:userName/notes', (req, res) => {
    res.send(users.find(user => user.username === req.params.userName).notes);
});

app.put('/:userName/notes/:noteId', (req, res) => {
    try {
        users.find(user => user.username === req.params.userName).notes[req.params.noteId] = req.body;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userName/notes/:noteId/change_status', (req, res) => {
    try {
        users.find(user => user.username === req.params.userName).notes[req.params.noteId].position = req.body.position;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userName/notes/:noteId/update', (req, res) => {
    try {
        users.find(user => user.username === req.params.userName).notes[req.params.noteId].text = req.body.text;
        users.find(user => user.username === req.params.userName).notes[req.params.noteId].color = req.body.color;
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.post('/:userName/notes', (req, res) => {
    try {
        users.find(user => user.username === req.params.userName).notes.push(req.body);
        res.status(200).send(JSON.stringify(users.find(user => user.username === req.params.userName).notes.length - 1));
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.delete('/:userName/notes/:noteId', (req, res) => {
    try {
        users.find(user => user.username === req.params.userName).notes.splice(req.params.noteId, 1);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.listen(port);