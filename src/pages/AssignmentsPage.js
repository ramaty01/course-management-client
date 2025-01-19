import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://course-management-olsc.onrender.com';

function AssignmentsPage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [newAssignment, setNewAssignment] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourse = async () => {
    const { data } = await axios.get(`${API_URL}/courses`);
    const selectedCourse = data.find((course) => course._id === courseId);
    setCourse(selectedCourse);
  };

  const addAssignment = async () => {
    const { data } = await axios.post(`${API_URL}/courses/${courseId}/assignments`, { title: newAssignment });
    setCourse(data);
    setNewAssignment('');
  };

  const selectAssignment = (assignmentId) => {
    navigate(`/comments/${courseId}/${assignmentId}`);
  };

  return (
    <div>
      <h1>Assignments for {course?.name}</h1>
      <button onClick={() => navigate('/')}>Back to Courses</button>
      <input
        type="text"
        placeholder="Add new assignment"
        value={newAssignment}
        onChange={(e) => setNewAssignment(e.target.value)}
      />
      <button onClick={addAssignment}>Add Assignment</button>
      <ul>
        {course?.assignments.map((assignment) => (
          <li key={assignment._id} onClick={() => selectAssignment(assignment._id)}>
            {assignment.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AssignmentsPage;
