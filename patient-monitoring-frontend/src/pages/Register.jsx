import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const REGISTER = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $role: String!) {
    register(name: $name, email: $email, password: $password, role: $role) {
      token
      user {
        role
      }
    }
  }
`;

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'nurse' });
  const [register, { error }] = useMutation(REGISTER);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await register({ variables: form });

      if (data?.register?.token) {
        const { token, user } = data.register;
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);

        alert('Registration successful!');

        if (user.role === 'nurse') {
          navigate('/nursedashboard');
        } else if (user.role === 'patient') {
          navigate('/patientdashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert('Registration failed: No token returned.');
      }

    } catch (err) {
      alert('Registration failed!');
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Register</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            name="email"
            type="email"
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
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="nurse">Nurse</option>
            <option value="patient">Patient</option>
          </select>
          <button type="submit" style={styles.button}>Register</button>
        </form>
        {error && <p style={styles.error}>{error.message}</p>}
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
    background: '#28a745',
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
};
