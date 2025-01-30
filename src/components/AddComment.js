import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AddComment = () => {
  const { courseNoteId } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleAddComment = async () => {
    try {
      await axios.post(
        `${REACT_APP_API_URL}/notes/${courseNoteId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/view-comments/${courseNoteId}`);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div>
      <h2>Add Comment</h2>
      <textarea
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleAddComment}>Submit Comment</button>
    </div>
  );
};

export default AddComment;
