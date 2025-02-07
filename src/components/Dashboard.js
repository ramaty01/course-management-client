import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Dashboard = ({ role }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch all courses from the backend
  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/courses`)
      .then((response) => setCourses(response.data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  // Handle user sign out
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate(0);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await axios.delete(`${REACT_APP_API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button onClick={handleSignOut} className="btn btn-danger">Sign Out</button>
      </div>

      {/* Admin can add new courses */}
      {role === 'admin' && (
        <Link to="/add-course">
          <button  className="btn btn-primary mb-4">Add Course</button>
        </Link>
      )}

      <h2>Courses</h2>

      {/* Display courses dynamically */}
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course._id} className="col-md-4">
            <div className="card shadow-sm mb-3">
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">{course.description}</p>
                <p className="text-muted"><strong>Semester:</strong> {course.semester} {course.year}</p>
                <p className="text-muted"><strong>Format:</strong> {course.format}</p>

                {/* Button to View Modules for this course */}
                <Link to={`/view-modules/${course._id}`}>
                  <button> 📖 View Modules </button>
                </Link>

                {/* Edit Button for Admins */}
                {role === 'admin' && (
                      <Link to={`/edit-course/${course._id}`}>
                        <button> ✏️ Edit Course </button>
                      </Link>
                    )}

                {/* Delete Button for Admins */}
                {role === 'admin' && (
                <button onClick={() => handleDeleteCourse(course._id)} >
                      ❌ Delete Course 
                </button>
                  )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Dashboard;
