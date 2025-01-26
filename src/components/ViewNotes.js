import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewNotes = () => {
  const { courseId, assignmentId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch notes when the component loads
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(
          `https://course-management-olsc.onrender.com/courses/${courseId}/assignments/${assignmentId}/notes`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setNotes(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes');
        setLoading(false);
      }
    };

    fetchNotes();
  }, [courseId, assignmentId]);

  if (loading) {
    return <p>Loading notes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Notes</h2>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note, index) => (
            <li key={index}>{note.content}</li>
          ))}
        </ul>
      ) : (
        <p>No notes available for this assignment.</p>
      )}
    </div>
  );
};

export default ViewNotes;
