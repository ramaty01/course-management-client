import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ViewNotes = () => {
  const { moduleId } = useParams();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]); // New state for search filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Get user ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/modules/${moduleId}/notes`);
        setNotes(response.data);
        setFilteredNotes(response.data); // Initialize filtered notes
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch notes');
        setLoading(false);
      }
    };

    fetchNotes();
  }, [moduleId]);

  const handleVote = async (noteId, voteType) => {
    try {
      const response = await axios.put(
        `${REACT_APP_API_URL}/notes/${noteId}/vote`,
        { voteType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNotes(notes.map(note => (note._id === noteId ? response.data : note)));
      setFilteredNotes(filteredNotes.map(note => (note._id === noteId ? response.data : note)));
      navigate(0);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to vote');
    }
  };

  // Handle search input change
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    
    // Filter notes based on search term
    setFilteredNotes(notes.filter(note => note.content.toLowerCase().includes(query)));
  };

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Notes</h2>
      <p> </p>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <p> </p>
      {/* Button to add notes for the module */}
      <Link to={`/add-note/${moduleId}`}>
          <button>Add Note</button>
      </Link>

      

      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <div key={note._id}>
            <p>{note.content}</p>
            <p>Votes: {note.votes}</p>

            {/* Disable button if user already voted */}
            <button
              onClick={() => handleVote(note._id, 'upvote')}
              disabled={note.votedUsers.includes(userId)}
            >
              👍 Upvote
            </button>

            <button
              onClick={() => handleVote(note._id, 'downvote')}
              disabled={note.votedUsers.includes(userId)}
            >
              👎 Downvote
            </button>
            {/* Button to View Comments for the Note */}
            <Link to={`/view-comments/${note._id}`}>
              <button>View Comments</button>
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
