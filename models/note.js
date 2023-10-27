const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: String,
    body: String,
    bucket: String,
    priority: String,
    startDate: Date,
    dueDate: Date,
    progress: String
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;