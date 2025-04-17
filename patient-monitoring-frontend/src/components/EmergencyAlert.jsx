import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

// GraphQL mutation to send emergency alert
const SEND_ALERT = gql`
  mutation SendAlert($userId: ID!, $message: String!) {
    sendAlert(userId: $userId, message: $message) {
      id
      message
      createdAt
    }
  }
`;

export default function EmergencyAlert() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const [sendAlert, { loading }] = useMutation(SEND_ALERT);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendAlert({
        variables: {
          userId,
          message,
        },
      });
      setSuccess('Emergency alert sent!');
      setMessage('');
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Failed to send alert. Please try again.');
      setSuccess(null);
      console.error(err.message);
    }
  };

  return (
    <div>
      <h3>Emergency Alert</h3>
      <p style={{ color: 'gray', fontSize: '0.9rem' }}>
        This will notify first responders immediately.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Describe your emergency..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          style={{
            width: '100%',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '6px',
            border: '1px solid #ccc',
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Sending...' : 'Send Alert'}
        </button>
      </form>

      {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      {errorMsg && <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>}
    </div>
  );
}
