import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

const SUBMIT_SYMPTOMS = gql`
  mutation SubmitSymptoms($userId: ID!, $symptoms: [String!]!) {
    submitSymptoms(userId: $userId, symptoms: $symptoms) {
      id
      symptoms
      createdAt
    }
  }
`;

const symptomOptions = [
  'Fever',
  'Cough',
  'Shortness of breath',
  'Fatigue',
  'Loss of taste or smell',
  'Sore throat',
  'Headache',
  'Nasal congestion',
  'Muscle aches',
];

export default function SymptomChecklist() {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [submitSymptoms, { loading, error }] = useMutation(SUBMIT_SYMPTOMS);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitSymptoms({ variables: { userId, symptoms: selectedSymptoms } });
      alert('Symptoms submitted successfully!');
      setSelectedSymptoms([]);
    } catch (err) {
      alert('Submission failed');
    }
  };

  return (
    <div style={styles.card}>
      <h3>Symptom Checklist</h3>
      <form onSubmit={handleSubmit}>
        {symptomOptions.map((symptom) => (
          <label key={symptom} style={styles.checkbox}>
            <input
              type="checkbox"
              value={symptom}
              checked={selectedSymptoms.includes(symptom)}
              onChange={() => toggleSymptom(symptom)}
            />
            {symptom}
          </label>
        ))}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Symptoms'}
        </button>
        {error && <p style={styles.error}>Error: {error.message}</p>}
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: '#f9f9f9',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginTop: '1rem',
  },
  checkbox: {
    display: 'block',
    marginBottom: '0.5rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
  },
};
