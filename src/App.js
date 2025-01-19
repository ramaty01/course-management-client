import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CoursesPage from './pages/CoursesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import CommentsPage from './pages/CommentsPage';
import MenuBar from './components/MenuBar';

function App() {
  return (
    <Router>
      <MenuBar />
      <Routes>
        <Route path="/" element={<CoursesPage />} />
        <Route path="/assignments/:courseId" element={<AssignmentsPage />} />
        <Route path="/comments/:courseId/:assignmentId" element={<CommentsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
