import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ViewComments = ({ role }) => {
  const { courseNoteId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Get user ID
  const navigate = useNavigate();

  // Fetch Comments from the API
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/notes/${courseNoteId}/comments`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [courseNoteId]);

  // Delete Comment Function
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`${REACT_APP_API_URL}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      alert('Failed to delete comment');
    }
  };

  // Vote on a Comment
  const handleVote = async (commentId, voteType) => {
    try {
      const response = await axios.put(
        `${REACT_APP_API_URL}/comments/${commentId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Update the comment with the new vote count dynamically
      setComments(comments.map(comment =>
        comment._id === commentId ? response.data : comment
      ));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to vote');
    }
  };

  // Loading and Error Handling
  if (loading) return <div>Loading comments...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Comments</h2>
        <div className="d-flex">
          {/* Using button for navigation instead of Link */}
          <button onClick={() => navigate(-1)} className="btn btn-outline-secondary me-2">
            <span className="icon">↩</span> Back to Notes
          </button>
        </div>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment-item">
              <div>
                <p>{comment.content}</p>
                <p>Votes: {comment.votes}</p>
                <p>✍️ {comment.userId.username}</p>
                <p>🕒 {comment.timestamp}</p>

                {/* Upvote and Downvote Buttons */}
                <div>
                  <button
                    onClick={() => handleVote(comment._id, 'upvote')}
                    disabled={comment.votedUsers.includes(userId)}
                    className="btn-outline-primary"
                  >
                    👍 Upvote
                  </button>

                  <button
                    onClick={() => handleVote(comment._id, 'downvote')}
                    disabled={comment.votedUsers.includes(userId)}
                    className="btn-outline-danger"
                  >
                    👎 Downvote
                  </button>
                </div>

                {/* Edit Comment Button for Admins or Comment Author */}
                {(role === 'admin' || comment.userId?._id === userId) && (
                  <Link to={`/edit-comment/${comment._id}`}>
                    <button>✏️ Edit Comment</button>
                  </Link>
                )}

                {/* Delete Button for Admins or the Comment's Author */}
                {(role === 'admin' || comment.userId?._id === userId) && (
                  <button onClick={() => handleDeleteComment(comment._id)}>
                    
                    ❌ Delete Comment
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      {/* Button to Add a Comment to the Note */}
      <Link to={`/add-comment/${courseNoteId}`}>
        <button>Add Comment</button>
      </Link>
    </div>
  );
};

export default ViewComments;
