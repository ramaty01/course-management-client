import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const EditComment = () => {
  const { commentId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState({ content: '' });

  useEffect(() => {
    axios
      .get(`${REACT_APP_API_URL}/comments`)
      .then((response) => {
        const foundComment = response.data.find((c) => c._id === commentId);
        if (foundComment) setComment(foundComment);
        else alert('Comment not found');
      })
      .catch(() => alert('Failed to fetch comment details'));
  }, [commentId]);

  const handleChange = (e) => {
    setComment({ ...comment, content: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${REACT_APP_API_URL}/comments/${commentId}`, comment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate(-1); // Redirect back to the previous page
    } catch (error) {
      alert('Failed to update comment');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Comment</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Comment Content</label>
          <textarea
            className="form-control"
            value={comment.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Update Comment</button>
      </form>
    </div>
  );
};

export default EditComment;
