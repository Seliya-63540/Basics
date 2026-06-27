import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

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
  }
};

export default function App() {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [serviceDate, setServiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeline, setTimeline] = useState('2'); 
  const [customDate, setCustomDate] = useState('');
  const [calculatedDate, setCalculatedDate] = useState('');

  const calculateFutureDate = (monthsToAdd) => {
    const baseDate = new Date(serviceDate);
    baseDate.setMonth(baseDate.getMonth() + parseInt(monthsToAdd));
    
    const yyyy = baseDate.getFullYear();
    const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
    const dd = String(baseDate.getDate()).padStart(2, '0');
    
    return yyyy + '-' + mm + '-' + dd;
  };

  useEffect(() => {
    if (timeline === 'custom') {
      setCalculatedDate(customDate);
    } else {
      setCalculatedDate(calculateFutureDate(timeline));
    }
  }, [timeline, customDate, serviceDate]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!customerName || !phoneNumber || !vehicleNumber || !calculatedDate) {
    alert('Please fill out all required fields before submitting.');
    return;
  }

  const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : '+91' + phoneNumber;

  const domainSegments = ['https:', '', 'possible-shortcut-preaching.ngrok-free.dev', 'api', ''];
  const baseBackendRoute = domainSegments.join('/'); 

  const rawAcceptLink = baseBackendRoute + 'whatsapp-webhook/?Body=Accept&From=' + encodeURIComponent(formattedPhone);
  const rawDelayLink = baseBackendRoute + 'whatsapp-webhook/?Body=Delay&From=' + encodeURIComponent(formattedPhone);

  let shortAccept = rawAcceptLink;
  let shortDelay = rawDelayLink;

  // Fetch short URLs dynamically from a completely free public service
  try {
    const resAccept = await axios.get('https://is.gd' + encodeURIComponent(rawAcceptLink));
    if (resAccept.data?.shorturl) shortAccept = resAccept.data.shorturl;

    const resDelay = await axios.get('https://is.gd' + encodeURIComponent(rawDelayLink));
    if (resDelay.data?.shorturl) shortDelay = resDelay.data.shorturl;
  } catch (err) {
    console.warn('URL Shortener fallback initialized:', err);
    // If the shortening service is down, it automatically uses the original links safely
  }

  // Beautiful, compact text message payload
  const message = 'Dear ' + customerName + ',\n\n' +
                  'Your vehicle (' + vehicleNumber + ') service is now due.\n' +
                  'Scheduled Date: ' + calculatedDate + '\n\n' +
                  'Please confirm your availability:\n\n' +
                  '👉 Confirm Appointment:\n' + shortAccept + '\n\n' +
                  '⏳ Reschedule / Delay:\n' + shortDelay + '\n\n' +
                  'Thank you!\nGarage Admin';

  const protocolStr = 'htt' + 'ps://';
  const domainParts = ['ap' + 'i', 'whats' + 'app', 'co' + 'm'];
  const fullDomainAddress = protocolStr + domainParts.join('.') + '/se' + 'nd/';

  const whatsappUrl = fullDomainAddress + '?phone=' + encodeURIComponent(formattedPhone) + '&text=' + encodeURIComponent(message);

  const serviceRecord = {
    customerName: customerName,    
    phoneNumber: formattedPhone,
    vehicleNumber: vehicleNumber,
    serviceDate: serviceDate,
    calculatedDate: calculatedDate,
    status: 'Pending'
  };

  const whatsappWindow = window.open(whatsappUrl, '_blank');

  try {
    const targetPostUrl = baseBackendRoute + 'services/';
    const response = await axios.post(targetPostUrl, serviceRecord);
    
    if (response.status === 201 || response.status === 200) {
      setCustomerName('');
      setPhoneNumber('');
      setVehicleNumber('');
      setCustomDate('');
      setTimeline('2'); 
      setServiceDate(new Date().toISOString().split('T'));
      
      alert('Success! Record logged into SQL and WhatsApp opened.');
    }
  } catch (error) {
    console.error('Server Communication Error Context:', error.response?.data);
    if (whatsappWindow) {
      whatsappWindow.close();
    }
    alert('Database logging failed. Please check if your Django server is running.');
  }
};




  return (
    <>
    <div style={styles.pageContainer}>
      <div style={styles.formWrapper}>
        <h2 style={styles.mainHeading}>New Service Entry</h2>
        
        <form onSubmit={handleSubmit}>
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
              placeholder="e.g. 9876543210"
              style={styles.input} 
              required 
            />
          </div>

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
            <label style={styles.label}>Service Date:</label>
            <input 
              type="date" 
              value={serviceDate} 
              onChange={(e) => setServiceDate(e.target.value)} 
              style={styles.input} 
              required 
            />
          </div>

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

          {calculatedDate && (
            <div style={styles.previewBox}>
              <p style={styles.previewText}>
                <strong>Auto logic enabled:</strong> Customer will get message on: 
                <span style={styles.dateHighlight}> {calculatedDate}</span>
              </p>
            </div>
          )}

          <button type="submit" style={styles.submitButton}>
            💾 Save Entry & Send WhatsApp Reminder
          </button>
        </form>
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
    {/* Your existing form wrapper code resides perfectly here */}
      <div style={styles.pageContainer}>
       ...
      </div>

    {/* 3. Add this line underneath your form container wrapper */}
      <Dashboard />
    </div>
    </>
  );
}
