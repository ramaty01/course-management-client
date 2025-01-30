import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const ViewComments = () => {
  const { courseNoteId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <p>Loading comments...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Comments</h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment) => (
            <li key={comment._id}>
              {comment.content} <br />
              <small>Votes: {comment.votes}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default ViewComments;
