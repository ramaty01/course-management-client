import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5001';

function CommentsPage() {
  const { courseId, assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignment();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAssignment = async () => {
    const { data } = await axios.get(`${API_URL}/courses`);
    const course = data.find((c) => c._id === courseId);
    const selectedAssignment = course.assignments.find((a) => a._id === assignmentId);
    setAssignment(selectedAssignment);
  };

  const addComment = async () => {
    await axios.post(`${API_URL}/courses/${courseId}/assignments/${assignmentId}/comments`, {
      comment: newComment,
    });
    fetchAssignment();
    setNewComment('');
  };

  return (
    <div>
      <h1>Comments for {assignment?.title}</h1>
      <button onClick={() => navigate(`/assignments/${courseId}`)}>Back to Assignments</button>
      <input
        type="text"
        placeholder="Add new comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button onClick={addComment}>Add Comment</button>
      <ul>
        {assignment?.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
    </div>
  );
}

export default CommentsPage;
