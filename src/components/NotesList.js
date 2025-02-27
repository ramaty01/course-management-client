import React, { act, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoteItem from "./NoteItem";
import CommentSection from "./CommentSection";
import ModuleTabs from "./ModuleTabs";
import { set } from 'mongoose';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const NotesList = ({ role }) => {
    const { courseId } = useParams();
    const [courseName, setCourseName] = useState('');
    const [modules, setModules] = useState([]);
    const [notes, setNotes] = useState({});
    const [comments, setComments] = useState({});
    // const [content, setContent] = useState('');
    const [contentMap, setContentMap] = useState({}); // Store content for each note separately
    const [filteredNotes, setFilteredNotes] = useState([]); // New state for search filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeModule, setActiveModule] = useState(null);
    const userId = localStorage.getItem('userId'); // Get user ID
    const [newNoteContent, setNewNoteContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {

        const fetchCourseName = async () => {
            try {
                const response = await axios.get(`${REACT_APP_API_URL}/courses/${courseId}`);
                setCourseName(response.data.name);
            } catch (error) {
                console.error('Failed to fetch course name:', error);
            }
        };

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

                // Fetch comments for each note
                const commentsData = {};
                for (const module of moduleData) {
                    for (const note of notesData[module._id]) {
                        const commentsResponse = await axios.get(`${REACT_APP_API_URL}/notes/${note._id}/comments`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                        });
                        commentsData[note._id] = commentsResponse.data;
                    }
                }
                setComments(commentsData);

            } catch (err) {
                setError('Error fetching data');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseName();
        fetchModulesAndNotes();
    }, [courseId]);

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNoteContent.trim() || !activeModule) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${REACT_APP_API_URL}/modules/${activeModule}/notes`, 
                { content: newNoteContent }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/modules/${activeModule}/notes`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setNotes(prevNotes => ({
                ...prevNotes,
                [activeModule]: response.data, // Replace with fresh data including username
            }));

            setNewNoteContent('');
        } catch (error) {
            console.error('Failed to add note:', error);
        }
    };

    const handleDeleteNote = async (noteId, moduleId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await axios.delete(`${REACT_APP_API_URL}/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/modules/${activeModule}/notes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setNotes(prevNotes => ({
                ...prevNotes,
                [activeModule]: response.data, // Replace with fresh data including username
            }));
        } catch (error) {
            alert('Failed to delete note');
        }
    };

    const handleEditNote = async (noteId, newContent) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${REACT_APP_API_URL}/notes/${noteId}`, 
                { content: newContent }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // Update the note list without reloading
            setNotes(prevNotes => ({
                ...prevNotes,
                [activeModule]: prevNotes[activeModule].map(note =>
                    note._id === noteId ? { ...note, content: newContent } : note
                ),
            }));
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    const handleVote = async (noteId, voteType) => {
        try {
            await axios.put(
                `${REACT_APP_API_URL}/notes/${noteId}/vote`,
                { voteType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/modules/${activeModule}/notes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setNotes(prevNotes => ({
                ...prevNotes,
                [activeModule]: response.data, // Replace with fresh data including username
            }));
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to vote');
        }
    };

    const handleCommentVote = async (commentId, voteType, noteId) => {
        try {
            await axios.put(
                `${REACT_APP_API_URL}/comments/${commentId}/vote`,
                { voteType },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/notes/${noteId}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // After adding the comment, update the comments state for this note
            setComments(prevComments => ({
                ...prevComments,
                [noteId]: response.data // Add the new comment to the list
            }));

             // Clear the contentMap for this note after comment submission
             setContentMap(prevState => ({
                ...prevState,
                [noteId]: '' // Reset the content of the specific note
            }));

            
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to vote');
        }
    };

    const handleCommentFlag = async (commentId, noteId) => {
        try {
            await axios.put(
                `${REACT_APP_API_URL}/comments/${commentId}/flag`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/notes/${noteId}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setComments(prevComments => ({
                ...prevComments,
                [noteId]: response.data // Add the new comment to the list
            }));
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to flag comment');
        }
    };

    const handleNoteFlag = async (noteId) => {
        try {
            await axios.put(
                `${REACT_APP_API_URL}/notes/${noteId}/flag`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/modules/${activeModule}/notes`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setNotes(prevNotes => ({
                ...prevNotes,
                [activeModule]: response.data // Replace with fresh data including username
            }));
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to flag note');
        }
    };

    const handleAddComment = async (noteId, e) => {
        e.preventDefault();
        try {
            // Add comment via API
            await axios.post(
                `${REACT_APP_API_URL}/notes/${noteId}/comments`,
                { content: contentMap[noteId] },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            // Fetch updated notes to ensure userId and role are populated
            const response = await axios.get(`${REACT_APP_API_URL}/notes/${noteId}/comments`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // After adding the comment, update the comments state for this note
            setComments(prevComments => ({
                ...prevComments,
                [noteId]: response.data // Add the new comment to the list
            }));

            // Clear the contentMap for this note after comment submission
            setContentMap(prevState => ({
                ...prevState,
                [noteId]: '' // Reset the content of the specific note
            }));

        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const handleContentChange = (noteId, value) => {
        setContentMap(prevState => ({
            ...prevState,
            [noteId]: value,
        }));
    };

    const handleDeleteComment = async (commentId, noteId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await axios.delete(`${REACT_APP_API_URL}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            // Update the state correctly by filtering out the deleted comment
            setComments(prevComments => ({
                ...prevComments,
                [noteId]: prevComments[noteId].filter(comment => comment._id !== commentId),
            }));

        } catch (error) {
            alert('Failed to delete comment');
        }
    };



    if (loading) return <p>Loading notes...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">

            <div className="row">
                {/* Notes Content */}
                <div className="col-md-9">
                    {modules.length > 0 ? (
                        <div className="tab-content">
                            {modules.map((module) => (
                                <div key={module._id}
                                    className={`tab-pane fade ${activeModule === module._id ? 'show active' : ''}`}
                                >
                                    {notes[module._id]?.length > 0 ? (
                                        <ul className="list-group">
                                            {notes[module._id].map((note, index) => (
                                                <li key={note._id} className="list-group-item">

                                                    {/* Notes content section */}
                                                    <NoteItem note={note} role={role} userId={userId} index={index} handleVote={handleVote} handleDeleteNote={() => handleDeleteNote(note._id, module._id)} handleEditNote={handleEditNote} handleFlagNote={handleNoteFlag}></NoteItem>

                                                    {/* Comments section */}
                                                    {/* <CommentSection note={note} role={role} userId={userId}
                                                        comments={comments} contentMap={contentMap} handleAddComment={handleAddComment}
                                                        handleContentChange={handleContentChange} handleDeleteComment={(commentId) => handleDeleteComment(commentId, note._id)}
                                                    /> */}
                                                    {/* Accordion for comments */}
                                                    <div className="accordion accordion-flush mt-2" id={`accordion-${note._id}`}>
                                                        <div className="accordion-item">
                                                            <h2 className="accordion-header">
                                                                <button
                                                                    className="accordion-button collapsed"
                                                                    type="button"
                                                                    data-bs-toggle="collapse"
                                                                    data-bs-target={`#flush-collapse-${note._id}`}
                                                                    aria-expanded="false"
                                                                    aria-controls={`flush-collapse-${note._id}`}
                                                                >
                                                                    💬 Comments <span className="badge rounded-pill text-bg-light ms-2">{comments[note._id]?.length || 0}</span>
                                                                </button>
                                                            </h2>
                                                            <div
                                                                id={`flush-collapse-${note._id}`}
                                                                className="accordion-collapse collapse"
                                                                data-bs-parent={`#accordion-${note._id}`}
                                                            >
                                                                <div className="accordion-body">
                                                                    <CommentSection
                                                                        note={note}
                                                                        role={role}
                                                                        userId={userId}
                                                                        comments={comments || []}
                                                                        contentMap={contentMap}
                                                                        handleAddComment={handleAddComment}
                                                                        handleContentChange={handleContentChange}
                                                                        handleCommentVote={handleCommentVote}
                                                                        handleDeleteComment={(commentId) => handleDeleteComment(commentId, note._id)}
                                                                        handleCommentFlag={handleCommentFlag}
                                                                        setComments={setComments}
                                                                    />
                                                                </div>
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
                        </div>) :
                        (<p>No course modules</p>)
                    }
                </div>

                {/* Vertical Tabs Navigation */}
                <div className="col-md-3">
                    <div className="position-sticky" style={{ top: '60px' }}>
                        <h2>{courseName} <span className="badge rounded-pill text-bg-primary fs-6">{notes.length}</span></h2>
                        <p></p>
                        {/* Back button to return to the Modules */}
                        <div className="text-end">
                            <button className="btn btn-sm btn-light" onClick={() => navigate(-1)}>🔙</button>
                        </div>
                        <p></p>
                        <h6>Modules</h6>

                        <ModuleTabs modules={modules} activeModule={activeModule} setActiveModule={setActiveModule} />
                        {/* Add Note Form (Right-hand Side) */}
                        
                        <div className="mt-4">
                            <h5>Add a Note</h5>
                            <form onSubmit={handleAddNote}>
                                <textarea 
                                    className="form-control mb-2" 
                                    placeholder="Write your note here..." 
                                    value={newNoteContent} 
                                    onChange={(e) => setNewNoteContent(e.target.value)}
                                    required 
                                ></textarea>
                                <button type="submit" className="btn btn-primary w-100">➕ Add Note</button>
                            </form>
                        </div>
                        
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotesList;
