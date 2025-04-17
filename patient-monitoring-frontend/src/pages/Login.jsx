import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        role
      }
    }
  }
`;

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login({ variables: form });

      if (data?.login?.token) {
        const { token, user } = data.login;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);

        alert('Login successful!');

        if (user.role === 'nurse') {
          navigate('/nursedashboard');
        } else if (user.role === 'patient') {
          navigate('/patientdashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Login failed! Invalid response.');
      }
    } catch (err) {
      alert('Login failed!');
      console.error(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Login</button>
        </form>
        {error && <p style={styles.error}>{error.message}</p>}
        <p style={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
  },
  card: {
    background: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '1.5rem',
    fontSize: '1.5rem',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    background: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  error: {
    marginTop: '1rem',
    color: '#d9534f',
  },
  registerText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};
