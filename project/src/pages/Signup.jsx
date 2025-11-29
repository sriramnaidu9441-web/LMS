import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) return alert('Please fill all fields.');
    if (password !== confirmPassword) return alert('Passwords do not match.');

    const raw = localStorage.getItem('lmsUsers');
    const users = raw ? JSON.parse(raw) : [];
    const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) return alert('A user with that email already exists. Please sign in.');

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      role,
      createdAt: Date.now(),
    };

    const next = [newUser, ...users];
    localStorage.setItem('lmsUsers', JSON.stringify(next));

    // Auto-login after signup
    const userData = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    login(userData);

    // Navigate to dashboard
    switch (role) {
      case 'admin': navigate('/admin/dashboard'); break;
      case 'instructor': navigate('/instructor/dashboard'); break;
      case 'content-creator': navigate('/content-creator/dashboard'); break;
      default: navigate('/student/dashboard');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="form-control" />

          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="form-control" />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a password" className="form-control" />

          <label>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" className="form-control" />

          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="form-control">
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="content-creator">Content Creator</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn btn-primary btn-block">Sign up</button>
        </form>
        <div className="signup-foot">Already have an account? <a href="/login">Sign in</a></div>
      </div>
    </div>
  );
};

export default Signup;
