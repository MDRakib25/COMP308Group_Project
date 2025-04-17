import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome to your Dashboard</h2>
      <p>You are logged in 🎉</p>
    </div>
  );
}
