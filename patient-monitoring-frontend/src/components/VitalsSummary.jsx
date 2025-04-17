import React from 'react';
import { gql, useQuery } from '@apollo/client';

const GET_VITALS = gql`
  query GetVitals($userId: ID!) {
    getVitals(userId: $userId) {
      id
      temperature
      heartRate
      bloodPressure
      respiratoryRate
      createdAt
    }
  }
`;

export default function VitalsSummary({ patientId }) {
  const { data, loading, error } = useQuery(GET_VITALS, {
    variables: { userId: patientId },
    fetchPolicy: 'network-only',
  });

  if (loading) return <p>Loading summary...</p>;
  if (error) return <p>Error loading vitals summary: {error.message}</p>;

  const vitals = data.getVitals;

  return (
    <div style={styles.card}>
      <h3>Vitals Summary</h3>
      {vitals.length === 0 ? (
        <p>No vitals submitted yet.</p>
      ) : (
        <ul style={styles.list}>
          {vitals.map((v) => (
            <li key={v.id} style={styles.item}>
              <strong>Date:</strong> {new Date(v.createdAt).toLocaleDateString()} | 
              <strong> Temp:</strong> {v.temperature}°C |
              <strong> HR:</strong> {v.heartRate} bpm |
              <strong> BP:</strong> {v.bloodPressure} |
              <strong> RR:</strong> {v.respiratoryRate} bpm
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    marginTop: '2rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  item: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #ccc',
  },
};
