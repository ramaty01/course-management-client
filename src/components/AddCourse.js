import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const AddCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('online');
  const navigate = useNavigate();

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${REACT_APP_API_URL}/courses`,
        { name, description, semester, year, format },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      navigate('/');
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Course</h2>
      <form onSubmit={handleAddCourse}>
        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Semester</label>
          <input type="text" className="form-control" placeholder="Fall, Spring, etc." value={semester} onChange={(e) => setSemester(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <input type="number" className="form-control" value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Format</label>
          <select className="form-select" value={format} onChange={(e) => setFormat(e.target.value)} required>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Course</button>
      </form>
    </div>
  );
};

export default AddCourse;
