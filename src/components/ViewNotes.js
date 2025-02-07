import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const ViewNotes = ({role}) => {
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

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`${REACT_APP_API_URL}/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setNotes(notes.filter(note => note._id !== noteId));
      navigate(0);
    } catch (error) {
      alert('Failed to delete note');
    }
  };

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
    <div className="container">
      <h2 className="mb-4">Notes</h2>

      <p></p>
        {/* Back button to return to the Modules */}
          <button onClick={() => navigate(-1)}>Back to Modules</button>
      <p></p>

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
          <button className="btn btn-primary mb-3">Add Note</button>
      </Link>

      
      <div className="row">
      {filteredNotes.length > 0 ? (
        filteredNotes.map((note) => (
          <div key={note._id} className="col-md-6">
            <div className="card shadow-sm mb-3">
            <div className="card-body">
            <p className="card-text">{note.content}</p>
            <p className="text-muted">Votes: {note.votes}</p>
            <p className="text-muted">✍️ {note.userId.username}</p>
            <p className="text-muted">🕒 {note.timestamp}</p>

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

            {/* Edit Note Button for Admins or Note Author */}
            {(role === 'admin' || note.userId?._id === userId) && (
                <Link to={`/edit-note/${note._id}`} >
                <button>  ✏️ Edit note </button>
                </Link>
              )}

            {/* Delete Button for Admins or the Note's Author */}
            {(role === 'admin' || note.userId === userId) && (
                <button onClick={() => handleDeleteNote(note._id)} >
                  ❌ Delete note 
                </button>
            )}

            {/* Button to View Comments for the Note */}
            <Link to={`/view-comments/${note._id}`}>
              <button className="btn btn-outline-secondary">💬 View Comments</button>
            </Link>
            </div>
            </div>
          </div>
        ))
        
      ) : (
        <p>No notes available.</p>
      )}
      </div>
    </div>
  );
};

export default ViewNotes;
