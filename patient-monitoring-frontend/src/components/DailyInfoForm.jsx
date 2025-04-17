import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

// Mutation to submit daily vital info
const ADD_VITAL = gql`
  mutation AddVital(
    $userId: ID!,
    $temperature: Float,
    $heartRate: Int,
    $bloodPressure: String,
    $respiratoryRate: Int
  ) {
    addVital(
      userId: $userId,
      temperature: $temperature,
      heartRate: $heartRate,
      bloodPressure: $bloodPressure,
      respiratoryRate: $respiratoryRate
    ) {
      id
    }
  }
`;

export default function DailyInfoForm() {
  const [form, setForm] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: '',
    respiratoryRate: '',
  });
  const [success, setSuccess] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.userId;

  const [addVital, { loading }] = useMutation(ADD_VITAL);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVital({
        variables: {
          userId,
          temperature: parseFloat(form.temperature),
          heartRate: parseInt(form.heartRate),
          bloodPressure: form.bloodPressure,
          respiratoryRate: parseInt(form.respiratoryRate),
        },
      });
      setSuccess('Vitals submitted!');
      setForm({ temperature: '', heartRate: '', bloodPressure: '', respiratoryRate: '' });
      setErrorMsg(null);
    } catch (err) {
      setErrorMsg('Submission failed.');
      setSuccess(null);
      console.error(err.message);
    }
  };

  return (
    <div>
      <h3>Daily Health Entry</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input type="number" name="temperature" placeholder="Temperature (°C)" value={form.temperature} onChange={handleChange} required />
        <input type="number" name="heartRate" placeholder="Heart Rate (bpm)" value={form.heartRate} onChange={handleChange} required />
        <input type="text" name="bloodPressure" placeholder="Blood Pressure (e.g. 120/80)" value={form.bloodPressure} onChange={handleChange} required />
        <input type="number" name="respiratoryRate" placeholder="Respiratory Rate" value={form.respiratoryRate} onChange={handleChange} required />
        <button type="submit" disabled={loading} style={{ padding: '0.6rem', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
    </div>
  );
}
