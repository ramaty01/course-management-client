import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../logo.svg";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${REACT_APP_API_URL}/auth/register`, {
        email,
        username,
        password,
        role: 'user', // Default role for new users
      });
      alert('Registration successful! You can now log in.');
      navigate('/'); // Redirect to login
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    // <div>
    //   <h2>Sign Up</h2>
    //   <form onSubmit={handleSignUp}>
    //     <input
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Confirm Password"
    //       value={confirmPassword}
    //       onChange={(e) => setConfirmPassword(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Sign Up</button>
    //   </form>
    // </div>
    <div className="form-signin w-100 m-auto">
      <img className="mb-4" src={logo} alt="Logo" width="72" height="57"></img>
      <h1 className="h3 mb-3 fw-normal">Sign up new account</h1>
      <form onSubmit={handleSignUp}>
        <div className="form-floating">
          <input type="email" className="form-control" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <label htmlFor="email">Email</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required/>
            <label htmlFor="username">Username</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <label htmlFor="password">Password</label>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" id="confirmPassword" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
            <label htmlFor="confirmPassword">Confirm Password</label>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account?{' '}
        <button className="btn btn-info mt-2 ms-4" onClick={() => navigate('/')}>Login</button>
      </p>
    </div>
  );
};

export default SignUp;
