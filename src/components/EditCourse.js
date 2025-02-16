import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState({
    name: '',
    description: '',
    semester: '',
    year: '',
    format: 'online',
  });

  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/courses`)
      .then((response) => {
        const foundCourse = response.data.find((c) => c._id === courseId);
        if (foundCourse) setCourse(foundCourse);
        else alert('Course not found');
      })
      .catch(() => alert('Failed to fetch course details'));
  }, [courseId]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${REACT_APP_API_URL}/courses/${courseId}`, course, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate('/admin');
    } catch (error) {
      alert('Failed to update course');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Course Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={course.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={course.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Semester</label>
          <input
            type="text"
            className="form-control"
            name="semester"
            value={course.semester}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Year</label>
          <input
            type="number"
            className="form-control"
            name="year"
            value={course.year}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Format</label>
          <select className="form-select" name="format" value={course.format} onChange={handleChange} required>
            <option value="online">Online</option>
            <option value="in-person">In-Person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Update Course</button>
      </form>
    </div>
  );
};

export default EditCourse;
