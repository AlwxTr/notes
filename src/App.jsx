import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Charts from './Charts.jsx';

function App() {
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);
    const [updateForm, setUpdateForm] = useState({
        title: '',
        body: '',
        bucket: '',
        priority: '',
        startDate: '',
        dueDate: '',
        progress: '',
    });
    const [creatingNote, setCreatingNote] = useState(false);
    const [showChart, setShowChart] = useState(false);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const res = await axios.get('http://localhost:3000/notes');
        setNotes(res.data.notes);
    };

    const toggleUpdate = (note) => {
        setSelectedNote(note);
        setUpdateForm({
            title: note.title,
            body: note.body,
            bucket: note.bucket,
            priority: note.priority,
            startDate: note.startDate,
            dueDate: note.dueDate,
            progress: note.progress,
        });
    };

    const updateNote = async () => {
        const { title, body, bucket, priority, startDate, dueDate, progress } = updateForm;
        const res = await axios.put(`http://localhost:3000/notes/${selectedNote._id}`, {
            title,
            body,
            bucket,
            priority,
            startDate,
            dueDate,
            progress,
        });

        const updatedNotes = notes.map((note) => {
            if (note._id === selectedNote._id) {
                return res.data.note;
            } else {
                return note;
            }
        });

        setNotes(updatedNotes);
        setSelectedNote(null);
    };

    const deleteNote = async () => {
        await axios.delete(`http://localhost:3000/notes/${selectedNote._id}`);
        const updatedNotes = notes.filter((note) => note._id !== selectedNote._id);
        setNotes(updatedNotes);
        setSelectedNote(null);
    };

    const closePopUp = () => {
        setSelectedNote(null);
        setCreatingNote(false);
    };

    const renderNotesByBucket = (bucketName) => {
        return notes
            .filter((note) => note.bucket === bucketName)
            .map((note) => (
                <div key={note._id} className="note">
                    <h3 onClick={() => toggleUpdate(note)}>
                        {note.priority} - {note.title}
                    </h3>
                </div>
            ));
    };

    const openCreateNotePopup = () => {
        setCreatingNote(true);
        setSelectedNote(null);
        setUpdateForm({
            title: '',
            body: '',
            bucket: '',
            priority: '',
            startDate: '',
            dueDate: '',
            progress: '',
        });
    };

    const createNote = async () => {
        const { title, body, bucket, priority, startDate, dueDate, progress } = updateForm;
        const res = await axios.post('http://localhost:3000/notes', {
            title,
            body,
            bucket,
            priority,
            startDate,
            dueDate,
            progress,
        });

        setNotes([...notes, res.data.note]);
        setCreatingNote(false);
    };

    const navigateToCharts = () => {
        setShowChart(true);
    };

    return (
        <div className="App">
            {showChart ? (
                <div className="chart-container">
                    <Charts notes={notes} navigateToApp={() => setShowChart(false)} />
                </div>
            ) : (
                <div>
                    <h1>Planner</h1>
                    <button onClick={navigateToCharts}>Show Chart</button>
                    <div className="notes-container">
                        <div className="bucket-container">
                            <h3>Not started</h3>
                            <button type="button" onClick={openCreateNotePopup}>
                                <div className="addTask"> + Add task</div>
                            </button>
                            <div className="notatka">{renderNotesByBucket('Not started')}</div>
                        </div>
                        <div className="bucket-container">
                            <h3>In progress</h3>
                            <button type="button" onClick={openCreateNotePopup}>
                                <div className="addTask"> + Add task</div>
                            </button>
                            <div className="notatka">{renderNotesByBucket('In progress')}</div>
                        </div>
                        <div className="bucket-container">
                            <h3>Late</h3>
                            <button type="button" onClick={openCreateNotePopup}>
                                <div className="addTask"> + Add task</div>
                            </button>
                            <div className="notatka">{renderNotesByBucket('Late')}</div>
                        </div>
                        <div className="bucket-container">
                            <h3>Completed</h3>
                            <button type="button" onClick={openCreateNotePopup}>
                                <div className="addTask"> + Add task</div>
                            </button>
                            <div className="notatka">{renderNotesByBucket('Completed')}</div>
                        </div>
                    </div>
                    <label> </label>
                    {creatingNote || selectedNote ? (
                        <div className="popup">
                            <h2>{creatingNote ? 'Add task' : 'Edit Note'}</h2>
                            <form>
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={updateForm.title}
                                    onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                                />
                                <label htmlFor="body">Body:</label>
                                <textarea
                                    id="body"
                                    value={updateForm.body}
                                    onChange={(e) => setUpdateForm({ ...updateForm, body: e.target.value })}
                                    rows="4"
                                />
                                <label htmlFor="bucket">Bucket:</label>
                                <select
                                    id="bucket"
                                    value={updateForm.bucket}
                                    onChange={(e) => setUpdateForm({ ...updateForm, bucket: e.target.value })}
                                >
                                    <option value="Not started">Not started</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Late">Late</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <label htmlFor="priority">Priority:</label>
                                <select
                                    id="priority"
                                    value={updateForm.priority}
                                    onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })}
                                >
                                    <option value="Urgent">Urgent</option>
                                    <option value="Important">Important</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <label htmlFor="startDate">Start date:</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={updateForm.startDate}
                                    onChange={(e) => setUpdateForm({ ...updateForm, startDate: e.target.value })}
                                />
                                <label htmlFor="dueDate">Due date:</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={updateForm.dueDate}
                                    onChange={(e) => setUpdateForm({ ...updateForm, dueDate: e.target.value })}
                                />
                                <label htmlFor="progress">Progress:</label>
                                <select
                                    id="progress"
                                    value={updateForm.progress}
                                    onChange={(e) => setUpdateForm({ ...updateForm, progress: e.target.value })}
                                >
                                    <option value="Not started">Not started</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Late">Late</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <label></label>
                                {creatingNote ? (
                                    <button type="button" onClick={createNote}>
                                        Create Note
                                    </button>
                                ) : (
                                    <button type="button" onClick={updateNote}>
                                        Update Note
                                    </button>
                                )}
                                <button type="button" onClick={deleteNote}>
                                    Delete Note
                                </button>
                                <button type="button" onClick={closePopUp}>
                                    Close
                                </button>
                            </form>
                        </div>
                    ) : null}
                </div>
            )}

        </div>
    );

}

export default App;
