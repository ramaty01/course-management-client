import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const AddModule = () => {
  const { courseId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAddModule = async () => {
    try {
      await axios.post(
        `${REACT_APP_API_URL}/courses/${courseId}/modules`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  return (
    <div>
      <h2>Add Module</h2>
      <input type="text" placeholder="Module Name" value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleAddModule}>Add Module</button>
    </div>
  );
};

export default AddModule;
