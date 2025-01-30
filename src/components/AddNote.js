import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddNote = () => {
  const { moduleId } = useParams();
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleAddNote = async () => {
    try {
      await axios.post(
        `http://localhost:5001/modules/${moduleId}/notes`,
        { content },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  return (
    <div>
      <h2>Add Note</h2>
      <textarea placeholder="Write your note here..." value={content} onChange={(e) => setContent(e.target.value)} />
      <button onClick={handleAddNote}>Add Note</button>
    </div>
  );
};

export default AddNote;
