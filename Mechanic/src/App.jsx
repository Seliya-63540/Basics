import React, { useState, useEffect } from 'react';
import axios from 'axios';


const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    padding: '30px 20px',
    display: 'flex',
    justifyContent: 'center',
  },
  formWrapper: {
    maxWidth: '550px',
    width: '100%',
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  mainHeading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#1a1a1a',
    fontSize: '24px',
    borderBottom: '2px solid #28a745',
    paddingBottom: '10px',
  },
  sectionHeading: {
    margin: '15px 0 10px 0',
    color: '#333',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  fieldGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '15px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '15px',
    backgroundColor: '#fafafa',
  },
  previewBox: {
    backgroundColor: '#e8f4fd',
    borderLeft: '4px solid #1976d2',
    padding: '12px',
    borderRadius: '4px',
    marginTop: '15px',
  },
  previewText: {
    margin: 0,
    color: '#1d3557',
    fontSize: '14px',
  },
  dateHighlight: {
    color: '#d32f2f',
    fontWeight: 'bold',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background 0.2s',
  }
};



export default function App() {
  const handleSubmit = async (e) => {
  e.preventDefault();

  const serviceRecord = {
    // यहाँ बायीं तरफ (Left side) वाले नाम Django के हिसाब से होने चाहिए
    customerName: customerName,    
    phoneNumber: phoneNumber,
    vehicleNumber: vehicleNumber,
    serviceDate: serviceDate,
    calculatedDate: calculatedDate,
    status: 'Pending'
  };
  
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/services/', serviceRecord);
    if (response.status === 201) {
      alert('congratulations! Data saved successfully.');
      // फॉर्म खाली करें
      setCustomerName('');
      setPhoneNumber('');
    }
  } catch (error) {
    console.error('Error Details:', error.response?.data); // यह असली एरर बताएगा
    alert('Data not saved. Please check the console.');
  }``
};
  // --- Form States ---
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]); // Default: Today
  
  // --- Reminder States ---
  const [timeline, setTimeline] = useState('2'); // Default: 2 Months
  const [customDate, setCustomDate] = useState('');
  const [calculatedDate, setCalculatedDate] = useState('');

  // Function to calculate future date
  const calculateFutureDate = (monthsToAdd) => {
    const baseDate = new Date(serviceDate);
    baseDate.setMonth(baseDate.getMonth() + parseInt(monthsToAdd));
    
    const yyyy = baseDate.getFullYear();
    const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
    const dd = String(baseDate.getDate()).padStart(2, '0');
    
    return `${yyyy}-${mm}-${dd}`;
  };

  // Update calculated date whenever timeline, service date or custom date changes
  useEffect(() => {
    if (timeline === 'custom') {
      setCalculatedDate(customDate);
    } else {
      setCalculatedDate(calculateFutureDate(timeline));
    }
  }, [timeline, customDate, serviceDate]);

  return (
    <div style={styles.pageContainer}>
      <div style={styles.formWrapper}>
        <h2 style={styles.mainHeading}>New Service Entry</h2>
        
        <form onSubmit={handleSubmit}>
          
          {/* Section 1: Customer Info */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Customer Name:</label>
            <input 
              type="text" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              placeholder="e.g. Rajesh Sharma"
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone Number (WhatsApp):</label>
            <input 
              type="tel" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              placeholder="e.g. +919876543210"
              style={styles.input} 
              required 
            />
          </div>

          {/* Section 2: Vehicle Info */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Vehicle Number:</label>
            <input 
              type="text" 
              value={vehicleNumber} 
              onChange={(e) => setVehicleNumber(e.target.value)} 
              placeholder="e.g. GJ 05 AB 1234"
              style={styles.input} 
              required 
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Service Date (Today):</label>
            <input 
              type="date" 
              value={serviceDate} 
              onChange={(e) => setServiceDate(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

          {/* Section 3: Next Service Reminder Logic */}
          <h3 style={styles.sectionHeading}>Reminder Settings</h3>
          
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Next Service After:</label>
            <select 
              value={timeline} 
              onChange={(e) => setTimeline(e.target.value)} 
              style={styles.select}
            >
              <option value="2">2 Months (60 Days)</option>
              <option value="3">3 Months (90 Days)</option>
              <option value="6">6 Months (180 Days)</option>
              <option value="custom">Custom Date</option>
            </select>
          </div>

          {timeline === 'custom' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Choose Custom Date:</label>
              <input 
                type="date" 
                value={customDate} 
                onChange={(e) => setCustomDate(e.target.value)} 
                style={styles.input}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          )}

          {/* Real-time Reminder Preview */}
          {calculatedDate && (
            <div style={styles.previewBox}>
              <p style={styles.previewText}>
                <strong>Auto logic enabled:</strong> Customer will get message on: 
                <span style={styles.dateHighlight}> {calculatedDate}</span>
              </p>
            </div>
          )}

          <button type="submit" style={styles.submitButton}>
            Save & Set Reminder
          </button>

        </form>
      </div>
    </div>
  );
}
