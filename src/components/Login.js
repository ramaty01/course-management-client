import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../logo.svg";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
        username,
        password,
      });
      const { token, role, userId } = response.data;
      setToken(token);
      setRole(role);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
    } catch (error) {
      console.error('Login failed');
    }
  };

  return (
    <div className="form-signin w-100 m-auto">
      <img className="mb-4" src={logo} alt="Logo" width="72" height="57"></img>
      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
      <form onSubmit={handleLogin}>
        <div className="form-floating">
          <input type="text" className="form-control" id="Username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            <label htmlFor="Username">Username</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <label htmlFor="password">Username</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
      </form>
      <p>
        Don’t have an account?{' '}
        <button className="btn btn-info mt-2 ms-4" onClick={() => navigate('/signup')}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
