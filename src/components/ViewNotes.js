import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

const ViewNotes = ({ role }) => {
  const { moduleId } = useParams();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get(`${REACT_APP_API_URL}/modules/${moduleId}/notes`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setNotes(response.data);
        setFilteredNotes(response.data);
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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    setFilteredNotes(notes.filter(note => note.content.toLowerCase().includes(query)));
  };

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2 className="mb-4">Notes</h2>
      <div className="d-flex justify-content-end mb-3">
        {/* Back button on the right */}
        <ActionButton
          label="Back to Modules"
          onClick={() => navigate(-1)}
          className="btn-outline-secondary"
          icon="↩"
        />
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={handleSearch}
        className="form-control mb-3"
      />

      <Link to={`/add-note/${moduleId}`}>
        <ActionButton
          label="Add Note"
          onClick={() => {}}
          className="btn-primary"
          icon="➕"
        />
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

                  <ActionButton
                    label="👍 Upvote"
                    onClick={() => handleVote(note._id, 'upvote')}
                    disabled={note.votedUsers.includes(userId)}
                    className="btn-outline-primary"
                  />

                  <ActionButton
                    label="👎 Downvote"
                    onClick={() => handleVote(note._id, 'downvote')}
                    disabled={note.votedUsers.includes(userId)}
                    className="btn-outline-danger"
                  />

                  {(role === 'admin' || note.userId?._id === userId) && (
                    <Link to={`/edit-note/${note._id}`}>
                      <ActionButton
                        label="✏️ Edit note"
                        onClick={() => {}}
                        className="btn-outline-success"
                      />
                    </Link>
                  )}

                  {(role === 'admin' || note.userId === userId) && (
                    <ActionButton
                      label="❌ Delete note"
                      onClick={() => handleDeleteNote(note._id)}
                      className="btn-outline-danger"
                    />
                  )}

                  <Link to={`/view-comments/${note._id}`}>
                    <ActionButton
                      label="💬 View Comments"
                      onClick={() => {}}
                      className="btn-outline-secondary"
                    />
                  </Link>

                  {note.isFlagged && role === 'admin' && (
                    <span className="text-danger" title="This note is flagged">🚩 Flagged</span>
                  )}
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
