import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AddAssignment = () => {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddAssignment = async () => {
    try {
      await axios.post(
        `https://course-management-olsc.onrender.com/courses/${courseId}/assignments`,
        { title, description },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Assignment added successfully');
    } catch (error) {
      console.error('Failed to add assignment:', error);
    }
  };

  return (
    <div>
      <h2>Add New Assignment</h2>
      <input
        type="text"
        placeholder="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddAssignment}>Add Assignment</button>
    </div>
  );
};

export default AddAssignment;
