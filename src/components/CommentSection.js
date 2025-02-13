import React from "react";
import { Link } from "react-router-dom";

const CommentSection = ({ note, role, userId, comments, contentMap, handleAddComment, handleContentChange, handleDeleteComment, handleCommentVote }) => {
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
                                <span className="ms-2">{comment.content}</span>
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
                                    <Link to={`/edit-comment/${comment._id}`}>
                                    <button className="btn btn-sm btn-light ms-2">✏️</button>
                                    </Link>
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
