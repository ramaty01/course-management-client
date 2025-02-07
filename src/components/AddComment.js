import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AddComment = () => {
  const { courseNoteId } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleAddComment = async (e) => {
    e.preventDefault();
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
    <div className="container mt-4">
      <h2>Add Comment</h2>
      <form onSubmit={handleAddComment}>
        <div className="mb-3">
          <label className="form-label">Comment Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Add Comment</button>
      </form>
    </div>
  );
};

export default AddComment;
