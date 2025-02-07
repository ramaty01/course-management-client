import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const AddModule = () => {
  const { courseId } = useParams();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${REACT_APP_API_URL}/courses/${courseId}/modules`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate(`/view-modules/${courseId}`);
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Module</h2>
      <form onSubmit={handleAddModule}>
        <div className="mb-3">
          <label className="form-label">Module Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Module</button>
      </form>
    </div>
  );
};

export default AddModule;
