import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ role }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear token and role
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate(0); // Redirect to login page
  };

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://course-management-olsc.onrender.com/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <p>Loading courses...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Add the Sign Out button */}
      <button onClick={handleSignOut}>Sign Out</button>
      {/* Admin role actions */}
      {role === 'admin' && (
        <div>
          <Link to="/add-course">
            <button>Add Course</button>
          </Link>
        </div>
      )}

      {/* Display courses and assignments */}
      <div>
        <h2>Courses</h2>
        {courses.map((course) => (
          <div key={course._id}>
            <h3>{course.name}</h3>
            <p>{course.description}</p>

            {/* Assignments within the course */}
            <h4>Assignments</h4>
            {course.assignments.length > 0 ? (
              course.assignments.map((assignment) => (
                <div key={assignment._id}>
                  <h5>{assignment.title}</h5>
                  <p>{assignment.description}</p>

                  {/* Add notes link (for users) */}
                  <Link to={`/add-note/${course._id}/${assignment._id}`}>
                    <button>Add Note</button>
                  </Link>

                  {/* View notes link (for everyone) */}
                  <Link to={`/view-notes/${course._id}/${assignment._id}`}>
                    <button>View Notes</button>
                  </Link>
                </div>
              ))
            ) : (
              <p>No assignments added yet.</p>
            )}

            {/* Add assignment link (for admins) */}
            {role === 'admin' && (
              <Link to={`/add-assignment/${course._id}`}>
                <button>Add Assignment</button>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
