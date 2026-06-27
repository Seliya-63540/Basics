import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  dashboardContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    width: '100%',
    margin: '30px auto',
  },
  title: {
    color: '#1a1a1a',
    fontSize: '22px',
    marginBottom: '20px',
    borderBottom: '2px solid #007bff',
    paddingBottom: '10px',
  },
  metricsWrapper: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
  },
  metricCard: {
    flex: 1,
    padding: '15px',
    borderRadius: '6px',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '14px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    fontSize: '14px',
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 10px',
    textAlign: 'left',
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #e0e0e0',
  },
  statusBadge: (status) => {
    let bg = '#6c757d';
    if (status === 'Confirmed') bg = '#28a745';
    if (status === 'Delayed') bg = '#ffc107';
    if (status === 'Pending') bg = '#17a2b8';
    return {
      backgroundColor: bg,
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    };
  },
  refreshButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '15px',
  }
};

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const currentOrigin = window.location.origin;
      const baseBackendRoute = currentOrigin.replace(':5173', ':8000') + '/api/services/';
      const response = await axios.get(baseBackendRoute);
      
      // SAFE CHECK: Force array wrapping if data returns as a singular object dictionary
      if (response.data && Array.isArray(response.data)) {
        setRecords(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setRecords([response.data]); // Encapsulate object inside a valid list array
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Failed to fetch pipeline records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Safe validation layers for processing filter executions
  const safeRecords = Array.isArray(records) ? records : [];
  const totalPending = safeRecords.filter(r => r.status === 'Pending').length;
  const totalConfirmed = safeRecords.filter(r => r.status === 'Confirmed').length;
  const totalDelayed = safeRecords.filter(r => r.status === 'Delayed').length;

  if (loading) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Loading Dashboard Metrics...</p>;

  return (
    <div style={styles.dashboardContainer}>
      <h2 style={styles.title}>Garage Operations Overview</h2>
      
      <div style={styles.metricsWrapper}>
        <div style={{ ...styles.metricCard, backgroundColor: '#17a2b8' }}>
          Pending Response: {totalPending}
        </div>
        <div style={{ ...styles.metricCard, backgroundColor: '#28a745' }}>
          Confirmed Booking: {totalConfirmed}
        </div>
        <div style={{ ...styles.metricCard, backgroundColor: '#ffc107', color: '#212529' }}>
          Rescheduled / Delayed: {totalDelayed}
        </div>
      </div>

      <button style={styles.refreshButton} onClick={fetchRecords}>
        🔄 Refresh Live Data
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Customer Name</th>
            <th style={styles.th}>Phone Number</th>
            <th style={styles.th}>Vehicle Code</th>
            <th style={styles.th}>Target Reminder Date</th>
            <th style={styles.th}>Allocated Slot Time</th>
            <th style={styles.th}>Current Status</th>
          </tr>
        </thead>
        <tbody>
          {safeRecords.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ ...styles.td, textAlign: 'center', color: '#888' }}>
                No active tracking records logged in database.
              </td>
            </tr>
          ) : (
            safeRecords.map((record, index) => (
              <tr key={record.id || index}>
                <td style={styles.td}>{record.customer_name || record.customerName || 'N/A'}</td>
                <td style={styles.td}>{record.phone_number || record.phoneNumber || 'N/A'}</td>
                <td style={styles.td}>{record.vehicle_number || record.vehicleNumber || 'N/A'}</td>
                <td style={styles.td}>{record.reminder_date || record.calculatedDate || record.reminderDate || 'N/A'}</td>
                <td style={styles.td}>{record.appointment_time || 'Not Scheduled'}</td>
                <td style={styles.td}>
                  <span style={styles.statusBadge(record.status || 'Pending')}>{record.status || 'Pending'}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
