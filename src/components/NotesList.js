import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const NotesList = ({ role }) => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [notes, setNotes] = useState({});
    const [filteredNotes, setFilteredNotes] = useState([]); // New state for search filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const userId = localStorage.getItem('userId'); // Get user ID
    const navigate = useNavigate();

    useEffect(() => {
        const fetchModulesAndNotes = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');

                // Fetch all modules for this course
                const moduleResponse = await axios.get(`${REACT_APP_API_URL}/courses/${courseId}/modules`);
                const moduleData = moduleResponse.data;
                setModules(moduleData);
                setActiveModule(moduleData.length > 0 ? moduleData[0]._id : null);

                // Fetch notes for each module
                const notesData = {};
                for (const module of moduleData) {
                    const response = await axios.get(`${REACT_APP_API_URL}/modules/${module._id}/notes`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    notesData[module._id] = response.data;
                }
                setNotes(notesData);
                console.log('notes', notes);
            } catch (err) {
                setError('Error fetching data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchModulesAndNotes();
    }, [courseId]);

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await axios.delete(`${REACT_APP_API_URL}/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setNotes(notes.filter(note => note._id !== noteId));
            navigate(0);

        } catch (error) {
            alert('Failed to delete note');
        }
    };

    const handleVote = async (noteId, voteType) => {
        try {
            const response = await axios.put(
                `${REACT_APP_API_URL}/notes/${noteId}/vote`,
                { voteType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setNotes(notes.map(note => (note._id === noteId ? response.data : note)));

            navigate(0);
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to vote');
        }
    };


    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">

            <div className="row">
                {/* Notes Content */}
                <div className="col-md-9">
                    <div className="tab-content">
                        {modules.map((module) => (
                            <div key={module._id}
                                className={`tab-pane fade ${activeModule === module._id ? 'show active' : ''}`}
                            >
                                {notes[module._id]?.length > 0 ? (
                                    <ul className="list-group">
                                        {notes[module._id].map((note, index) => (
                                            <li key={note._id} className="list-group-item">
                                                <h6 className="text-end fw-bold me-2">📋 #{index + 1}
                                                    {/* Show Flag Icon if Note is Flagged */}
                                                    {(note.isFlagged && role === 'admin') && (
                                                        <span className="text-danger" title="This note is flagged">🚩 Flagged</span>
                                                    )}
                                                </h6>
                                                <br />
                                                <p className="mt-1">{note.content}</p>


                                                <div className="text-end">

                                                    <div className="text-end">
                                                        {/* Disable button if user already voted */}
                                                        <button className="btn btn-sm btn-light ms-2" onClick={() => handleVote(note._id, 'upvote')}
                                                            disabled={note.votedUsers.includes(userId)}>👍</button>

                                                        <button className="btn btn-sm btn-light ms-2" onClick={() => handleVote(note._id, 'downvote')}
                                                            disabled={note.votedUsers.includes(userId)}>👎</button>

                                                        {/* Edit Note Button for Admins or Note Author */}
                                                        {(role === 'admin' || note.userId?._id === userId) && (
                                                            <Link to={`/edit-note/${note._id}`} >
                                                                <button className="btn btn-sm btn-light ms-2">✏️</button>
                                                            </Link>
                                                        )}
                                                        {/* Delete Button for Admins or the Note's Author */}
                                                        {(role === 'admin' || note.userId === userId) && (
                                                            <button className="btn btn-sm btn-light ms-2" onClick={() => handleDeleteNote(note._id)} >
                                                                ❌
                                                            </button>
                                                        )}
                                                    </div>


                                                    <small className="text-muted">Votes: {note.votes}</small>
                                                    <small className="text-muted ms-3">✍️ {note.userId.username}</small>
                                                    <small className="text-muted ms-3">🕒 {new Date(note.timestamp).toLocaleString()}</small>

                                                </div>


                                                {/* Comments section */}
                                                <div className="">

                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title text-start">💬 Comments
                                                                <span className="badge rounded-pill text-bg-primary ms-2 tf-6">99+</span>
                                                            </h5>
                                                            <div className="form-floating">
                                                                <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea"></textarea>
                                                                <label htmlFor="floatingTextarea">Comments</label>
                                                                <div className="text-end mt-2 mb-2">
                                                                    {/* Edit Note Button for Admins or Note Author */}
                                                                    <Link to={`/edit-note/${note._id}`} >
                                                                        <button className="btn btn-sm btn-outline-primary">Add Comments</button>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                <li className="list-group-item ">
                                                                    <div className="d-flex justify-content-between">
                                                                        <span className="fw-bold">#1</span>
                                                                        <span className="ms-2">Some Comments here, asdfasdf 1, Some Comments here, asdfasdf 1, Some Comments here, asdfasdf 1, Some Comments here, asdfasdf 1</span>

                                                                    </div>

                                                                    <div className="text-start">
                                                                        <small className="text-muted">Votes: {note.votes}</small>
                                                                        <small className="text-muted ms-3">✍️ {note.userId.username}</small>
                                                                        <small className="text-muted ms-3">🕒 {new Date(note.timestamp).toLocaleString()}</small>
                                                                    </div>

                                                                </li>
                                                                <li className="list-group-item d-flex justify-content-between">
                                                                    <span className="fw-bold">#2</span>
                                                                    <span className="ms-2">Some Comments here, asdfasdf 2</span>
                                                                </li>
                                                                <li className="list-group-item d-flex justify-content-between">
                                                                    <span className="fw-bold">#3</span>
                                                                    <span className="ms-2">Some Comments here, asdfasdf 3</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>

                                                </div>



                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted">No notes available for this module.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Vertical Tabs Navigation */}
                <div className="col-md-3">
                    <div className="position-sticky" style={{ top: '60px' }}>
                        <h2>Course Notes <span className="badge rounded-pill text-bg-primary fs-6">{notes.length}</span></h2>
                        <p></p>
                        {/* Back button to return to the Modules */}
                        <div className="text-end">
                            <button className="btn btn-sm btn-light" onClick={() => navigate(-1)}>🔙</button>
                        </div>
                        <p></p>
                        <h6>Modules</h6>
                        <div className="nav flex-column nav-pills" role="tablist" aria-orientation="vertical">
                            {modules.map((module) => (
                                <button
                                    key={module._id}
                                    className={`nav-link ${activeModule === module._id ? 'active' : ''}`}
                                    onClick={() => setActiveModule(module._id)}
                                    role="tab"
                                >
                                    {module.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotesList;
