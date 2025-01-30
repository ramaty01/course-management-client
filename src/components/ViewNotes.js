import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewNotes = () => {
  const { moduleId } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5001/modules/${moduleId}/notes`)
      .then(response => setNotes(response.data))
      .catch(error => console.error('Failed to fetch notes:', error));
  }, [moduleId]);

  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.length > 0 ? notes.map((note, index) => (
          <li key={index}>{note.content}</li>
        )) : <p>No notes available.</p>}
      </ul>
    </div>
  );
};

export default ViewNotes;
