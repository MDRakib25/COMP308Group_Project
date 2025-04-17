import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

import VitalForm from '../components/VitalForm';
import SendTip from '../components/SendTip';
import VitalsList from '../components/VitalsList';
import ConditionAdvisor from '../components/ConditionAdvisor';

const GET_PATIENTS = gql`
  query GetPatients {
    getPatients {
      id
      name
      email
    }
  }
`;

const TABS = {
  VITALS: 'Enter Vitals',
  HISTORY: 'Previous Vitals',
  TIPS: 'Send Tip',
  ADVICE: 'Health Advice'
};

export default function NurseDashboard() {
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const nurseId = decoded.userId;

  const { data, loading, error } = useQuery(GET_PATIENTS);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [activeTab, setActiveTab] = useState(TABS.VITALS);

  useEffect(() => {
    if (data?.getPatients?.length > 0) {
      setSelectedPatientId((prev) => prev || data.getPatients[0].id);
    }
  }, [data]);

  const handleChange = (e) => {
    setSelectedPatientId(e.target.value);
  };

  const renderTabContent = () => {
    if (!selectedPatientId) return null;
    switch (activeTab) {
      case TABS.VITALS:
        return <VitalForm patientId={selectedPatientId} />;
      case TABS.HISTORY:
        return <VitalsList patientId={selectedPatientId} />;
      case TABS.TIPS:
        return <SendTip nurseId={nurseId} patientId={selectedPatientId} />;
      case TABS.ADVICE:
        return <ConditionAdvisor patientId={selectedPatientId} />;
      default:
        return null;
    }
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

      <div style={styles.tabContainer}>
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab ? '#007bff' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#000'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.card}>{renderTabContent()}</div>
    </div>
  );
}

const styles = {
  dashboard: {
    padding: '2rem',
    maxWidth: '900px',
    margin: '0 auto'
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem'
  },
  selectorContainer: {
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  label: {
    marginRight: '1rem',
    fontWeight: 'bold'
  },
  select: {
    padding: '0.5rem',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  tab: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  },
  card: {
    padding: '1.5rem',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
  },
  text: {
    textAlign: 'center'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  }
};
