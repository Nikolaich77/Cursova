const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const app = express();
const port = 8000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://test:test@cluster0.hurnxsp.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

function initDB(){
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    client.connect()
    return client.db('Notes').collection('Tasks');
}

collection = initDB();

function dbAddUser(uid, name, email){
    try {
        collection.insertOne({uid: uid, name: name, email: email, notes: []});
    }
    finally {
        
    }
}

async function dbVerifyUser(uid){
    try{
        users = await collection.findOne({ uid: uid })
        if (await users) {
            return true;
        }else {
            return false;
        }
    }finally{
    }
}

async function dbUpdateNote(uid, noteid, fields){
    try {
        notes = await dbGetNotes(uid);
        note = notes[noteid];
        if (fields.text) {
            note.text = fields.text;
        }
        if (fields.color) {
            note.color = fields.color;
        }
        if (fields.position) {
            note.position = fields.position;
        }
        notes[noteid] = note;
        await collection.updateOne({ uid: uid }, { $set: { notes: notes } });
    } finally {
    }
}

async function dbDeleteNote(uid, noteid){
    try {
        notes = await dbGetNotes(uid);
        notes.splice(noteid, 1);
        await collection.updateOne({ uid: uid }, { $set: { notes: notes } });
    } finally {
    }
}

async function dbGetNotes(iuid){
    try {
        const filter = await { uid: iuid };

        let user = await collection.findOne(filter);
        return await user.notes;
    } finally {
    }
}

async function dbInsertNote(iuid, note){
    try {

        notes = await dbGetNotes(iuid);
        
        await notes.push(note);
        await console.log(notes);
        await collection.updateOne({ uid: iuid }, { $set: { notes: notes } })
        return await notes.length - 1;
        
    } finally {

    }
}


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
        dbVerifyUser(hash).then((result) => {
            console.log(result);
            if (result) {
                res.status(200).send(hash);
            } else {
                res.sendStatus(404);
            }
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/login/signup', (req, res) => {
    try {
        var hash = crypto.createHash('sha1').update(req.body.email + req.body.password).digest('hex');
        dbVerifyUser(hash).then((result) => {
            if (result) {
                res.sendStatus(409);
            } else {
                console.log('register : ' + hash);
                dbAddUser(hash, req.body.name, req.body.email);
                users.push({uid: hash, name: req.body.name, email: req.body.email, notes: []});
                res.status(200).send(hash);
            }
        });
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/:userID/notes', (req, res) => {
    dbGetNotes(req.params.userID).then((user) => {
        res.send(user);
    });
});

app.put('/:userID/notes/:noteId', (req, res) => {
    try {
        dbGetNotes(req.params.userID).then((notes) => {
            res.status(200).send(notes[req.params.noteId]);
        });
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userID/notes/:noteId/change_status', (req, res) => {
    try {
        dbUpdateNote(req.params.userID, req.params.noteId, {position: req.body.position});
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.put('/:userID/notes/:noteId/update', (req, res) => {
    try {
        dbUpdateNote(req.params.userID, req.params.noteId, {text: req.body.text, color: req.body.color});
        res.sendStatus(200);
    } catch (error) {
        res.status(404).send(error);
    }
});

app.post('/:userID/notes', (req, res) => {
    try {
        dbInsertNote(req.params.userID, req.body).then((id) => {
            res.status(200).send(JSON.stringify(id));
        });
        
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.delete('/:userID/notes/:noteId', (req, res) => {
    try {
        dbDeleteNote(req.params.userID, req.params.noteId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(404);
    }
});

app.listen(port);