import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const EditModule = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState({ name: '' });

  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/modules`)
      .then((response) => {
        const foundModule = response.data.find((c) => c._id === moduleId);
        if (foundModule) setModule(foundModule);
        else alert('Module not found');
      })
      .catch(() => alert('Failed to fetch module details'));
  }, [moduleId]);

  const handleChange = (e) => {
    setModule({ ...module, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${REACT_APP_API_URL}/modules/${moduleId}`, module, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate('/admin');
    } catch (error) {
      alert('Failed to update module');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Module</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Module Name</label>
          <input
            type="text"
            className="form-control"
            value={module.name}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Module</button>
      </form>
    </div>
  );
};

export default EditModule;
