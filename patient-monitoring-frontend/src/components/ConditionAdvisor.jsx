import React, { useState } from 'react';
import axios from 'axios';

export default function ConditionAdvisor() {
  const [symptoms, setSymptoms] = useState({
    fever: false,
    cough: false,
    fatigue: false,
    headache: false,
  });

  const [advice, setAdvice] = useState('');
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSymptoms((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async () => {
    try {
      const symptomValues = Object.values(symptoms).map((val) => (val ? 1 : 0));
      const response = await axios.post('http://localhost:5001/predict', {
        symptoms: symptomValues,
      });
      setAdvice(response.data.advice);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Something went wrong while trying to fetch health advice.');
    }
  };

  return (
    <div style={styles.card}>
      <h3>Health Condition Advisor</h3>
      <p>Select the symptoms you're experiencing:</p>
      <div style={styles.checkboxGroup}>
        {Object.keys(symptoms).map((key) => (
          <label key={key} style={styles.checkboxLabel}>
            <input
              type="checkbox"
              name={key}
              checked={symptoms[key]}
              onChange={handleCheckboxChange}
            />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
      <button onClick={handleSubmit} style={styles.button}>Analyze</button>

      {advice && <p style={styles.advice}><strong>Advice:</strong> {advice}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    marginTop: '1.5rem',
  },
  checkboxGroup: {
    marginBottom: '1rem',
  },
  checkboxLabel: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  button: {
    padding: '0.6rem 1.2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  advice: {
    marginTop: '1rem',
    color: '#2d862d',
  },
  error: {
    color: '#d9534f',
    marginTop: '1rem',
  },
};
