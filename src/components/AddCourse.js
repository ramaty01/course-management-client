import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleAddCourse = async () => {
    try {
      await axios.post(
        'http://localhost:5001/courses',
        { name, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  return (
    <div>
      <h2>Add Course</h2>
      <input type="text" placeholder="Course Name" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button onClick={handleAddCourse}>Add Course</button>
    </div>
  );
};

export default AddCourse;
