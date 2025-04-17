import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

import VitalForm from '../components/VitalForm';
import SendTip from '../components/SendTip';

const GET_PATIENTS = gql`
  query GetPatients {
    getPatients {
      id
      name
      email
    }
  }
`;

export default function NurseDashboard() {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const nurseId = decoded.userId;

  const { data, loading, error } = useQuery(GET_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  useEffect(() => {
    if (data?.getPatients?.length > 0) {
      setSelectedPatientId((prev) => prev || data.getPatients[0].id);
    }
  }, [data]);

  const handleChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  if (loading) return <p style={styles.text}>Loading patients...</p>;
  if (error) return <p style={styles.error}>Error: {error.message}</p>;

  return (
    <div style={styles.dashboard}>
      <h2 style={styles.title}>Nurse Dashboard</h2>

      <div style={styles.selectorContainer}>
        <label style={styles.label}>Select Patient:</label>
        <select
          value={selectedPatientId || ''}
          onChange={handleChange}
          style={styles.select}
        >
          {data.getPatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.email})
            </option>
          ))}
        </select>
      </div>

      {selectedPatientId && (
        <>
          {/* a. Enter vitals */}
          <VitalForm patientId={selectedPatientId} />

          {/* c. Send motivational tips */}
          <SendTip nurseId={nurseId} patientId={selectedPatientId} />
        </>
      )}
    </div>
  );
}

const styles = {
  dashboard: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
  },
  selectorContainer: {
    marginBottom: '1rem',
    textAlign: 'center',
  },
  label: {
    marginRight: '1rem',
    fontWeight: 'bold',
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  text: {
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};
