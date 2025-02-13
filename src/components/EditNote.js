import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const EditNote = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ content: '' });
// test
  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/notes`)
      .then((response) => {
        const foundNote = response.data.find((c) => c._id === noteId);
        if (foundNote) setNote(foundNote);
        else alert('Note not found');
      })
      .catch(() => alert('Failed to fetch note details'));
  }, [noteId]);

  const handleChange = (e) => {
    setNote({ ...note, content: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${REACT_APP_API_URL}/notes/${noteId}`, note, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate(-1); // Redirect back to the previous page
    } catch (error) {
      alert('Failed to update note');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Course Note</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Note Content</label>
          <textarea
            className="form-control"
            value={note.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Update Note</button>
      </form>
    </div>
  );
};

export default EditNote;
