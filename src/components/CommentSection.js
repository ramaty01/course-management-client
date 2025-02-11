import React from "react";

const CommentSection = ({ note, role, userId, comments, contentMap, handleAddComment, handleContentChange, handleDeleteComment }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title text-start">💬 Comments
                    <span className="badge rounded-pill text-bg-light ms-2">{comments[note._id]?.length || 0}</span>
                </h5>

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
                        <button type="submit" className="btn btn-sm btn-outline-primary">Add Comment</button>
                    </div>
                </form>

                {/* Display Comments */}
                <ul className="list-group list-group-flush">
                    {comments[note._id]?.map((comment, index) => (
                        <li key={comment._id} className="list-group-item">
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">#{index + 1}</span>
                                <span className="ms-2">{comment.content}</span>
                            </div>
                            <div className="text-start">
                                <small className="text-muted">Votes: {comment.votes}</small>
                                <small className="text-muted ms-3">✍️ {comment.userId.username}</small>
                                <small className="text-muted ms-3">🕒 {new Date(comment.timestamp).toLocaleString()}</small>

                                 {/* Delete Button for Admins or the Comment's Author */}
                                 {(role === 'admin' || comment.userId._id === userId) && (
                                    <button className="btn btn-sm btn-light ms-2" onClick={() => handleDeleteComment(comment._id)} >
                                        ❌
                                    </button>
                                )}
                            </div>
                            <div className="text-start">

                               
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CommentSection;
