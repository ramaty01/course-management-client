import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ViewComments = ({role}) => {
  const { courseNoteId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Get user ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/notes/${courseNoteId}/comments`);
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch comments');
        setLoading(false);
      }
    };

    fetchComments();
  }, [courseNoteId]);

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

  const handleVote = async (commentId, voteType) => {
    try {
      const response = await axios.put(
        `${REACT_APP_API_URL}/comments/${commentId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments(comments.map(comment => (comment._id === commentId ? response.data : comment)));
      navigate(0);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to vote');
    }
  };

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-4">Comments</h2>
      <p></p>
        {/* Back button to return to the Notes */}
          <button onClick={() => navigate(-1)}>Back to Notes</button>
      <p></p>
      <div className="row">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="col-md-6">
            <div className="card shadow-sm mb-3">
            <div className="card-body">
            <p className="card-text">{comment.content}</p>
            <p className="text-muted">Votes: {comment.votes}</p>
            <p className="text-muted">✍️ {comment.userId.username}</p>
            <p className="text-muted">🕒 {comment.timestamp}</p>

            {/* Disable button if user already voted */}
            <button
              onClick={() => handleVote(comment._id, 'upvote')}
              disabled={comment.votedUsers.includes(userId)}
            >
              👍 Upvote
            </button>

            <button
              onClick={() => handleVote(comment._id, 'downvote')}
              disabled={comment.votedUsers.includes(userId)}
            >
              👎 Downvote
            </button>

            {/* Edit Comment Button for Admins or Comment Author */}
            {(role === 'admin' || comment.userId?._id === userId) && (
                <Link to={`/edit-comment/${comment._id}`}>
                <button>  ✏️ Edit comment </button>
                </Link>
              )}

            {/* Delete Button for Admins or the Comment's Author */}
            {(role === 'admin' || comment.userId === userId) && (
                <button onClick={() => handleDeleteComment(comment._id)} >
                  ❌ Delete comment
                </button>
              )}
          </div>
          </div>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}
      <p> </p>
      {/* Button to Add a Comment to the Note */}
      <Link to={`/add-comment/${courseNoteId}`}>
              <button>Add Comment</button>
      </Link>
      </div>
    </div>
  );
};

export default ViewComments;
