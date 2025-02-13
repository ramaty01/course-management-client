import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
// import Dashboard from './components/Dashboard';
import Home from './components/Home';
import AddCourse from './components/AddCourse';
import EditCourse from './components/EditCourse';
import AddModule from './components/AddModule';
import EditModule from './components/EditModule';
import AddNote from './components/AddNote';
import EditNote from './components/EditNote';
import ViewNotes from './components/ViewNotes';
import ViewModule from './components/ViewModule';
import ViewComments from './components/ViewComments';
import AddComment from './components/AddComment';
import EditComment from './components/EditComment';
import Header from './components/Header';
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from './components/common/Breadcrumb';
import NotesList from './components/NotesList';
import AdminPage from './components/AdminPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [role, setRole] = useState(localStorage.getItem('role') || '');

  if (!token) {
    return (
      <Router>
        <div className="container d-flex justify-content-center align-items-center vh-100">
        <Routes>
          <Route path="/" element={<Login setToken={setToken} setRole={setRole} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
        </div>
      </Router>
    );
  }

  return (
    <>
    <Router>
      <Header></Header>
      <Breadcrumb />
      <div className="container mt-3">
      <Routes>
        <Route path="/" element={<Home role={role} />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/edit-course/:courseId" element={<EditCourse />} />
        <Route path="/add-module/:courseId" element={<AddModule />} />
        <Route path="/view-modules/:courseId" element={<ViewModule role={role} />} />
        <Route path="/edit-module/:moduleId" element={<EditModule />} />
        <Route path="/add-note/:moduleId" element={<AddNote />} />
        <Route path="/view-notes/:moduleId" element={<ViewNotes role={role}/>} />
        <Route path="/courses/:courseId/notes/" element={<NotesList role={role}/>} />
        <Route path="/edit-note/:noteId" element={<EditNote />} />
        <Route path="/view-comments/:courseNoteId" element={<ViewComments role={role} />} />
        <Route path="/add-comment/:courseNoteId" element={<AddComment />} />
        <Route path="/edit-comment/:commentId" element={<EditComment />} />
        <Route path="/admin" element={<AdminPage role={role} />} />
      </Routes>
      </div>
    </Router>
    </>
  );
}

export default App;
