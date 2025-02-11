import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Dashboard = ({ role }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/courses`);
        setCourses(response.data);
      } catch {
        setError('Failed to fetch courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    navigate(0);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`${REACT_APP_API_URL}/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(courses.filter((course) => course._id !== courseId));
      } catch {
        alert('Failed to delete course.');
      }
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <div>
          <button onClick={handleSignOut} className="btn btn-danger">
            Sign Out
          </button>
        </div>
      </div>

      {role === 'admin' && (
        <Link to="/add-course">
          <button className="btn btn-primary mb-4">Add Course</button>
        </Link>
      )}

      <h2>Courses</h2>

      {courses.length > 0 ? (
        <div className="row">
          {courses.map((course) => (
            <div key={course._id} className="col-md-4">
              <div className="card shadow-sm mb-3">
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                  <p className="text-muted">
                    <strong>Semester:</strong> {course.semester} {course.year}
                  </p>
                  <p className="text-muted">
                    <strong>Format:</strong> {course.format}
                  </p>
                  <Link to={`/view-modules/${course._id}`}>
                    <button className="btn btn-outline-primary me-2">📖 View Modules</button>
                  </Link>
                  {role === 'admin' && (
                    <>
                      <Link to={`/edit-course/${course._id}`}>
                        <button className="btn btn-outline-success me-2">✏️ Edit</button>
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        className="btn btn-outline-danger"
                      >
                        ❌ Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Dashboard;
