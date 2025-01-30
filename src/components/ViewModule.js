import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ViewModule = () => {
  const { courseId } = useParams(); // Get courseId from URL
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch modules for the given course
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/courses/${courseId}/modules`);
        setModules(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch modules');
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  if (loading) return <p>Loading modules...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Modules for Course</h2>
      
      {modules.length > 0 ? (
        modules.map((module) => (
          <div key={module._id}>
            <h3>{module.name}</h3>

            {/* Button to add notes for the module */}
            <Link to={`/add-note/${module._id}`}>
              <button>Add Note</button>
            </Link>

            {/* Button to view notes for the module */}
            <Link to={`/view-notes/${module._id}`}>
              <button>View Notes</button>
            </Link>
          </div>
        ))
      ) : (
        <p>No modules available for this course.</p>
      )}

      {/* Back button to return to the Dashboard */}
      <Link to="/">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default ViewModule;
