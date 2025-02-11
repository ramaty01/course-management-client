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
            <h2>Course Notes</h2>
            <p></p>
            {/* Back button to return to the Modules */}
            <div className="text-end">
                <button className="btn btn-sm btn-light" onClick={() => navigate(-1)}>Back</button>
            </div>
            <p></p>
            <div className="row">
                {/* Notes Content */}
                <div className="col-md-9">
                    <div className="tab-content">
                        {modules.map((module) => (
                            <div
                                key={module._id}
                                className={`tab-pane fade ${activeModule === module._id ? 'show active' : ''}`}
                            >
                                {notes[module._id]?.length > 0 ? (
                                    <ul className="list-group">
                                        {notes[module._id].map((note) => (
                                            <li key={note._id} className="list-group-item">
                                                <p>{note.content}</p>

                                                <div className="text-end">
                                                    {/* Edit Note Button for Admins or Note Author */}
                                                    {(role === 'admin' || note.userId?._id === userId) && (
                                                        <Link to={`/edit-note/${note._id}`} >
                                                            <button className="btn btn-outline-warning">✏️ Edit</button>
                                                        </Link>
                                                    )}
                                                </div>

                                                {/* Delete Button for Admins or the Note's Author */}
                                                {(role === 'admin' || note.userId === userId) && (
                                                    <button onClick={() => handleDeleteNote(note._id)} >
                                                        ❌ Delete note
                                                    </button>
                                                )}

                                                <div className="text-end">
                                                    {/* Button to View Comments for the Note */}
                                                    <Link to={`/view-comments/${note._id}`}>
                                                        <button className="btn btn-outline-secondary">💬 View Comments </button>
                                                    </Link>
                                                </div>

                                                <div className="text-end">

                                                    <div className="text-end">
                                                        {/* Disable button if user already voted */}
                                                        <button className="btn btn-sm btn-light ms-3" onClick={() => handleVote(note._id, 'upvote')}
                                                            disabled={note.votedUsers.includes(userId)}>👍</button>

                                                        <button className="btn btn-sm btn-light ms-3" onClick={() => handleVote(note._id, 'downvote')}
                                                            disabled={note.votedUsers.includes(userId)}>👎</button>

                                                    </div>


                                                    <small className="text-muted">Votes: {note.votes}</small>
                                                    <small className="text-muted ms-3">✍️ {note.userId.username}</small>
                                                    <small className="text-muted ms-3">🕒 {new Date(note.timestamp).toLocaleString()}</small>

                                                </div>


                                                {/* Show Flag Icon if Note is Flagged */}
                                                {note.isFlagged && role === 'admin' && (
                                                    <span className="text-danger" title="This note is flagged">🚩 Flagged</span>
                                                )}
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
    );
};

export default NotesList;
