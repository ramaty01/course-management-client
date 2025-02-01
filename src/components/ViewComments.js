import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ViewComments = () => {
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

      <div className="row">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="col-md-6">
            <div className="card shadow-sm mb-3">
            <div className="card-body">
            <p className="card-text">{comment.content}</p>
            <p className="text-muted">Votes: {comment.votes}</p>

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
