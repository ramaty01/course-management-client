import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken, setRole }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/auth/login', {
        username,
        password,
      });
      const { token, role } = response.data;
      setToken(token);
      setRole(role);
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
    } catch (error) {
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
