import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const AddNote = () => {
  const { moduleId } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleAddNote = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${REACT_APP_API_URL}/modules/${moduleId}/notes`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/view-notes/${moduleId}`);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Course Note</h2>
      <form onSubmit={handleAddNote}>
        <div className="mb-3">
          <label className="form-label">Note Content</label>
          <textarea
            className="form-control"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Add Note</button>
      </form>
    </div>
  );
};

export default AddNote;
