import { React, useState } from "react";
import { Link } from "react-router-dom";

const NoteItem = ({ note, index, role, userId, handleVote, handleDeleteNote, handleEditNote, handleFlagNote}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(note.content);

    const startEditing = () => {
        setIsEditing(true);
        setEditedContent(note.content);
    };

    const saveEdit = () => {
        handleEditNote(note._id, editedContent);
        setIsEditing(false);
    };
    return (
        <div className="text-bg-light rounded p-2" style={{ borderRadius: '5rem' }}>
            <h6 className="text-end fw-bold me-2">📋 #{index + 1}
                {/* Show Flag Icon if Note is Flagged */}
                {(note.isFlagged && role === 'admin') && (
                    <span className="text-danger" title="This note is flagged">🚩 Flagged</span>
                )}
            </h6>
            <br />
            {/* In-place Editing */}
            {isEditing ? (
                <div>
                    <textarea
                        className="form-control"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <button className="btn btn-success btn-sm mt-1" onClick={saveEdit}>💾 Save</button>
                    <button className="btn btn-secondary btn-sm mt-1 ms-2" onClick={() => setIsEditing(false)}>❌ Cancel</button>
                </div>
            ) : (
                <p className="mt-1">{note.content}</p>
            )}


            <div className="text-end">

                <div className="text-end">
                    {/* Disable button if user already voted */}
                    <button className="btn btn-sm btn-light ms-2" onClick={() => handleVote(note._id, 'upvote')}
                        disabled={note.votedUsers.includes(userId)}>👍</button>

                    <button className="btn btn-sm btn-light ms-2" onClick={() => handleVote(note._id, 'downvote')}
                        disabled={note.votedUsers.includes(userId)}>👎</button>

                    {/* Flag Note Button for Admins or Note Author */}
                    {(role === 'admin' || role === 'teacher') && (
                        <button className="btn btn-sm btn-light ms-2" onClick={() => handleFlagNote(note._id)}>🚩</button>
                    )}
                    
                    {/* Edit Note Button for Admins or Note Author */}
                    {(role === 'admin' || role === 'teacher' || note.userId?._id === userId)  && !isEditing &&  (
                        <button className="btn btn-sm btn-light ms-2" onClick={startEditing}>✏️</button>
                    )}
                    {/* Delete Button for Admins or the Note's Author */}
                    {(role === 'admin' || role === 'teacher' || note.userId?._id === userId) && (
                        <button className="btn btn-sm btn-light ms-2" onClick={() => handleDeleteNote(note._id)} >
                            ❌
                        </button>
                    )}
                </div>


                <small className="text-muted">Votes: {note.votes}</small>
                <small className="text-muted ms-3">✍️ {note.userId.username}</small>
                <small className="text-muted ms-3">🕒 {new Date(note.timestamp).toLocaleString()}</small>

            </div>
        </div>
    );
};

export default NoteItem;
