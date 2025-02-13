import React from "react";
import { Link } from "react-router-dom";

const NoteItem = ({ note, index, role, userId, handleVote, handleDeleteNote }) => {
    return (
        <div className="text-bg-light rounded p-2" style={{ borderRadius: '5rem' }}>
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
                    {(role === 'admin' || role === 'teacher' || note.userId?._id === userId) && (
                        <Link to={`/edit-note/${note._id}`} >
                            <button className="btn btn-sm btn-light ms-2">✏️</button>
                        </Link>
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
