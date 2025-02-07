import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const ViewModule = ({role}) => {
  const { courseId } = useParams(); // Get courseId from URL
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch modules for the given course
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/courses/${courseId}/modules`);
        setModules(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch modules');
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;

    try {
      await axios.delete(`${REACT_APP_API_URL}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setModules(modules.filter(module => module._id !== moduleId));
    } catch (error) {
      alert('Failed to delete module');
    }
  };

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Modules for Course</h2>
      </div>
      <p></p>
        {/* Back button to return to the Dashboard */}
        <Link to="/">
          <button>Back to Dashboard</button>
        </Link>
      <p></p>
        {/* Admin can add new modules to this course */}
        {role === 'admin' && (
          <Link to={`/add-module/${courseId}`}>
            <button className="btn btn-primary mb-4">Add Module</button>
          </Link>
        )}
      <p></p>
      
      {modules.length > 0 ? (
        modules.map((module) => (
          <div key={module._id} className="col-md-4">
            <div className="card shadow-sm mb-3">
            <div className="card-body">
              <h3>{module.name}</h3>
            {/* Button to view notes for the module */}
            <Link to={`/view-notes/${module._id}`}>
              <button> 📝 View Notes </button>
            </Link>

            {/* Admin Edit Button */}
            {role === 'admin' && (
                <Link to={`/edit-module/${module._id}`}>
                <button>  ✏️ Edit module </button>
                </Link>
              )}

            {/* Admin Delete Button */}
            {role === 'admin' && (
              <button onClick={() => handleDeleteModule(module._id)}>
                ❌ Delete module 
              </button>
            )}
            </div>
            </div>
          </div>
        ))
      ) : (
        <p>No modules available for this course.</p>
      )}

    </div>
  );
};

export default ViewModule;
