//load env variables
if (process.env.NODE_ENV !=="production"){
    require("dotenv").config();
}

//import dependencies
const path = require('path');
const express = require('express');
const cors = require("cors");
const connectToDb = require('./config/connectToDb');
const notesController = require("./controllers/notesController");

//create an express app
const app = express()

//configure express app
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req,res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all domains (you can set specific domains)
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

//configure ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connect to database
connectToDb();

//routing

app.get('/notes', notesController.fetchNotes);

app.get('/notes/:id', notesController.fetchNote);

app.post('/notes', notesController.createNote);

app.put("/notes/:id", notesController.updateNote);

app.delete("/notes/:id", notesController.deleteNote);

//start our server
app.get('/addNote', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addNote.html'));
});

app.post('/notes', notesController.createNote);
app.listen(process.env.PORT);