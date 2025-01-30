import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const ViewNotes = () => {
  const { moduleId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/modules/${moduleId}/notes`);
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes');
        setLoading(false);
      }
    };

    fetchNotes();
  }, [moduleId]);

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Notes</h2>
      {notes.length > 0 ? (
        notes.map((note) => (
          <div key={note._id}>
            <p>{note.content}</p>
            <p><small>Votes: {note.votes}</small></p>
            {/* Button to View Comments for the Note */}
            <Link to={`/view-comments/${note._id}`}>
              <button>View Comments</button>
            </Link>

            {/* Button to Add a Comment to the Note */}
            <Link to={`/add-comment/${note._id}`}>
              <button>Add Comment</button>
            </Link>
          </div>
        ))
      ) : (
        <p>No notes available.</p>
      )}
    </div>
  );
};

export default ViewNotes;
