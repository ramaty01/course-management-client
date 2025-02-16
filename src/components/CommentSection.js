import { React, useState } from "react";
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CommentSection = ({ note, role, userId, comments, contentMap, handleAddComment, handleContentChange, handleDeleteComment, handleCommentVote, setComments }) => {
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState({});

    const startEditing = (comment) => {
        setEditingCommentId(comment._id);
        setEditedCommentContent({ ...editedCommentContent, [comment._id]: comment.content });
    };

    const handleSaveComment = async (commentId, noteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${REACT_APP_API_URL}/comments/${commentId}`,
                { content: editedCommentContent[commentId] },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update the comment in the state immediately
            setComments(prevComments => ({
                ...prevComments,
                [noteId]: prevComments[noteId].map(comment =>
                    comment._id === commentId ? { ...comment, content: editedCommentContent[commentId] } : comment
                ),
            }));

            setEditingCommentId(null);
        } catch (error) {
            console.error('Failed to update comment:', error);
        }
    };

    return (
        <div className="card">
            <div className="card-body">
                {/* <h5 className="card-title text-start">💬 Comments
                    <span className="badge rounded-pill text-bg-light ms-2">{comments[note._id]?.length || 0}</span>
                </h5> */}

                {/* Display Comments */}
                <ul className="list-group list-group-flush">
                    {comments[note._id]?.map((comment, index) => (
                        <li key={comment._id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">#{index + 1}</span>
                                {/* Show Flag Icon if Note is Flagged */}
                                    {(comment.isFlagged && (role === 'admin' || role === 'teacher')) && (
                                        <span className="text-danger" title="This comment is flagged">🚩 Flagged</span>
                                    )}
                                 <div className="text-start mt-2">
                                {editingCommentId === comment._id ? (
                                    <div>
                                        <textarea
                                            className="form-control"
                                            value={editedCommentContent[comment._id] || ''}
                                            onChange={(e) => setEditedCommentContent({ ...editedCommentContent, [comment._id]: e.target.value })}
                                        />
                                        <button className="btn btn-success btn-sm mt-1" onClick={() => handleSaveComment(comment._id, note._id)}>💾 Save</button>
                                        <button className="btn btn-secondary btn-sm mt-1 ms-2" onClick={() => setEditingCommentId(null)}>❌ Cancel</button>
                                    </div>
                                ) : (
                                    <p>{comment.content}</p>
                                )}
                            </div>
                            </div>
                            <div className="text-start">

                            <div className="text-start">

                                {/* Disable button if user already voted */}
                                <button className="btn btn-sm btn-light ms-2" onClick={() => handleCommentVote(comment._id, 'upvote', comment.courseNoteId)}
                                    disabled={comment.votedUsers.includes(userId)}>👍</button>

                                <button className="btn btn-sm btn-light ms-2" onClick={() => handleCommentVote(comment._id, 'downvote', comment.courseNoteId)}
                                    disabled={comment.votedUsers.includes(userId)}>👎</button>

                                {/* Edit Comment Button for Admins or Comment Author */}
                                {(role === 'admin' || role === 'teacher' || comment.userId?._id === userId) && (
                                    <button className="btn btn-sm btn-light ms-2" onClick={() => startEditing(comment)}>✏️</button>
                                )}

                                {/* Delete Button for Admins or the Comment's Author */}
                                {(role === 'admin' || role === 'teacher' || comment.userId._id === userId) && (
                                    <button className="btn btn-sm btn-light ms-2" onClick={() => handleDeleteComment(comment._id)} >
                                        ❌
                                    </button>
                                )}
                            </div>

                            <small className="text-muted">Votes: {comment.votes}</small>
                            <small className="text-muted ms-3">✍️ {comment.userId.username}</small>
                            <small className="text-muted ms-3">🕒 {new Date(comment.timestamp).toLocaleString()}</small>
                            


                            </div>
                        </li>
                    ))}
                </ul>

                {/* Add Comment Form */}
                <form onSubmit={(e) => handleAddComment(note._id, e)}>
                    <textarea
                        className="form-control"
                        placeholder="Leave a comment here"
                        value={contentMap[note._id] || ""}
                        onChange={(e) => handleContentChange(note._id, e.target.value)}
                        required
                    ></textarea>
                    <div className="text-end mt-2 mb-2">
                        <button type="submit" className="btn btn-sm btn-outline-primary">Comment</button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default CommentSection;
