import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'https://course-management-olsc.onrender.com';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data } = await axios.get(`${API_URL}/courses`);
    setCourses(data);
  };

  const addCourse = async () => {
    const { data } = await axios.post(`${API_URL}/courses`, { name: newCourse });
    setCourses([...courses, data]);
    setNewCourse('');
  };

  const selectCourse = (courseId) => {
    navigate(`/assignments/${courseId}`);
  };

  return (
    <div>
      <h1>Courses</h1>
      <input
        type="text"
        placeholder="Add new course"
        value={newCourse}
        onChange={(e) => setNewCourse(e.target.value)}
      />
      <button onClick={addCourse}>Add Course</button>
      <ul>
        {courses.map((course) => (
          <li key={course._id} onClick={() => selectCourse(course._id)}>
            {course.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CoursesPage;
