import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const ADD_VITAL = gql`
  mutation AddVital($userId: ID!, $temperature: Float, $heartRate: Int, $bloodPressure: String, $respiratoryRate: Int) {
    addVital(userId: $userId, temperature: $temperature, heartRate: $heartRate, bloodPressure: $bloodPressure, respiratoryRate: $respiratoryRate) {
      id
      temperature
      heartRate
      bloodPressure
      respiratoryRate
      createdAt
    }
  }
`;

export default function VitalForm({ patientId }) {
  const [form, setForm] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
  });

  const [addVital, { error }] = useMutation(ADD_VITAL);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVital({
        variables: {
          userId: patientId,
          temperature: parseFloat(form.temperature),
          heartRate: parseInt(form.heartRate),
          bloodPressure: form.bloodPressure,
          respiratoryRate: parseInt(form.respiratoryRate),
        },
      });
      alert('Vitals submitted successfully');
      setForm({ temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
    } catch (err) {
      console.error('Error submitting vitals:', err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Enter Vital Signs</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          name="temperature"
          placeholder="Temperature (°C)"
          value={form.temperature}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="heartRate"
          placeholder="Heart Rate (bpm)"
          value={form.heartRate}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="bloodPressure"
          placeholder="Blood Pressure (e.g. 120/80)"
          value={form.bloodPressure}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="respiratoryRate"
          placeholder="Respiratory Rate (breaths/min)"
          value={form.respiratoryRate}
          onChange={handleChange}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Submit Vitals</button>
      </form>
      {error && <p style={styles.error}>{error.message}</p>}
    </div>
  );
}

const styles = {
  container: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '1rem auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1rem',
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
  },
  error: {
    marginTop: '1rem',
    color: '#d9534f',
    textAlign: 'center',
  },
};
