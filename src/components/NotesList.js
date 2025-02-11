import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const NotesList = () => {
    const { courseId } = useParams();
    const [modules, setModules] = useState([]);
    const [notes, setNotes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeModule, setActiveModule] = useState(null);

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

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Course Notes</h2>
            <div className="row">
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
                                                <small className="text-muted">Votes: {note.votes}</small>
                                                <small className="text-muted ms-3">✍️ {note.userId.username}</small>
                                                <small className="text-muted ms-3">🕒 {new Date(note.timestamp).toLocaleString()}</small>
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
            </div>
        </div>
    );
};

export default NotesList;
