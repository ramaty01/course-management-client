import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ActionButton = ({ label, onClick, disabled, className, icon, type = 'button' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`btn ${className} mb-2`}
    type={type}
  >
    {icon && <span>{icon}</span>} {label}
  </button>
);

const ViewModule = ({ role }) => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/courses/${courseId}/modules`);
        setModules(response.data);
      } catch (err) {
        setError('Failed to fetch modules');
      } finally {
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

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="spinner-border text-light" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Modules for Course</h2>
        <Link to="/">
          <ActionButton
            label="Back to Dashboard"
            onClick={() => {}}
            className="btn-outline-secondary"
            icon="↩"
          />
        </Link>
      </div>
  
      {/* Conditionally render Add Module button for admins */}
      {role === 'admin' && (
        <Link to={`/add-module/${courseId}`}>
          <ActionButton
            label="Add Module"
            onClick={() => {}}
            className="btn-primary"
            icon="➕"
          />
        </Link>
      )}

      <div className="row">
        {modules.length > 0 ? (
          modules.map((module) => (
            <div key={module._id} className="col-md-4 mb-3">
              <div className="card shadow-sm border-light rounded">
                <div className="card-body">
                  <h5 className="card-title text-dark">{module.name}</h5>

                  {/* View Notes Button */}
                  <Link to={`/view-notes/${module._id}`}>
                    <ActionButton
                      label="View Notes"
                      onClick={() => {}}
                      className="btn-outline-info text-dark"
                      icon="📘"
                    />
                  </Link>

                  {/* Admin Edit Button */}
                  {role === 'admin' && (
                    <Link to={`/edit-module/${module._id}`}>
                      <ActionButton
                        label="Edit Module"
                        onClick={() => {}}
                        className="btn-warning"
                        icon="✏️"
                      />
                    </Link>
                  )}

                  {/* Admin Delete Button */}
                  {role === 'admin' && (
                    <ActionButton
                      label="Delete Module"
                      onClick={() => handleDeleteModule(module._id)}
                      className="btn-danger"
                      icon="❌"
                    />
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No modules available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default ViewModule;
