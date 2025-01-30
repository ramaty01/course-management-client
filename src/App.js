import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import AddCourse from './components/AddCourse';
import AddModule from './components/AddModule';
import AddNote from './components/AddNote';
import ViewNotes from './components/ViewNotes';
import ViewModule from './components/ViewModule';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard role={role} />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/add-module/:courseId" element={<AddModule />} />
        <Route path="/view-modules/:courseId" element={<ViewModule />} />
        <Route path="/add-note/:moduleId" element={<AddNote />} />
        <Route path="/view-notes/:moduleId" element={<ViewNotes />} />
      </Routes>
    </Router>
  );
}

export default App;
