import React, { useState } from 'react';
import EmergencyAlert from '../components/EmergencyAlert';
import DailyInfoForm from '../components/DailyInfoForm';
import SymptomChecklist from '../components/SymptomChecklist';

const TABS = {
  ALERT: 'Emergency Alert',
  DAILY: 'Daily Health Entry',
  SYMPTOMS: 'Symptom Checklist',
};

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState(TABS.ALERT);

  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.ALERT:
        return <EmergencyAlert />;
      case TABS.DAILY:
        return <DailyInfoForm />;
      case TABS.SYMPTOMS:
        return <SymptomChecklist />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Patient Dashboard</h2>

      <div style={styles.tabContainer}>
        {Object.values(TABS).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              backgroundColor: activeTab === tab ? '#007bff' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#000',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.card}>
        {renderTabContent()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem',
    color: '#333',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  tab: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
  },
  card: {
    padding: '1.5rem',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
};
