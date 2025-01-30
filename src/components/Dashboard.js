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
    navigate(0);
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleSignOut}>Sign Out</button>

      {/* Admin can add new courses */}
      {role === 'admin' && (
        <Link to="/add-course">
          <button>Add Course</button>
        </Link>
      )}

      <h2>Courses</h2>

      {/* Display courses dynamically */}
      {courses.length > 0 ? (
        courses.map((course) => (
          <div key={course._id}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>

            {/* Button to View Modules for this course */}
            <Link to={`/view-modules/${course._id}`}>
              <button>View Modules</button>
            </Link>

            {/* Admin can add new modules to this course */}
            {role === 'admin' && (
              <Link to={`/add-module/${course._id}`}>
                <button>Add Module</button>
              </Link>
            )}
          </div>
        ))
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Dashboard;
