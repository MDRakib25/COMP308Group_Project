import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const SEND_TIP = gql`
  mutation SendTip($nurseId: ID!, $patientId: ID!, $message: String!) {
    sendTip(nurseId: $nurseId, patientId: $patientId, message: $message) {
      id
      message
      createdAt
    }
  }
`;

export default function SendTip({ nurseId, patientId }) {
  const [message, setMessage] = useState('');
  const [sendTip, { error }] = useMutation(SEND_TIP);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendTip({ variables: { nurseId, patientId, message } });
      alert('Tip sent successfully!');
      setMessage('');
    } catch (err) {
      console.error('Error sending tip:', err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Send Motivational Tip</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <textarea
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter motivational message..."
          rows={4}
          style={styles.textarea}
          required
        />
        <button type="submit" style={styles.button}>Send Tip</button>
      </form>
      {error && <p style={styles.error}>{error.message}</p>}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    background: '#ffffff',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '500px',
    margin: '2rem auto',
  },
  header: {
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  textarea: {
    resize: 'none',
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
  },
  error: {
    marginTop: '1rem',
    color: '#d9534f',
    textAlign: 'center',
  },
};
