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

export default function VitalsList({ patientId }) {
  const { data, loading, error } = useQuery(GET_VITALS, {
    variables: { userId: patientId },
    fetchPolicy: 'network-only', // Ensure fresh fetch
  });

  if (loading) return <p style={styles.text}>Loading vitals...</p>;
  if (error) return <p style={styles.error}>Error: {error.message}</p>;

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Previous Clinical Vitals</h3>
      {data.getVitals.length === 0 ? (
        <p style={styles.text}>No vitals found for this patient.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Temp (°C)</th>
              <th>Heart Rate</th>
              <th>Blood Pressure</th>
              <th>Resp. Rate</th>
            </tr>
          </thead>
          <tbody>
            {data.getVitals.map((vital) => (
              <tr key={vital.id}>
                <td>{new Date(vital.createdAt).toLocaleDateString()}</td>
                <td>{vital.temperature}</td>
                <td>{vital.heartRate}</td>
                <td>{vital.bloodPressure}</td>
                <td>{vital.respiratoryRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    background: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  text: {
    textAlign: 'center',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    color: '#d9534f',
  },
};
