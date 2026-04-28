import React, { useState, useEffect } from 'react';
import { reportAPI } from '../utils/api';
import { FileEdit, MapPin, AlertCircle, Camera, User, Send, CheckCircle, XCircle } from 'lucide-react';
import '../styles/report.css';

const ReportCrime = () => {
  const [formData, setFormData] = useState({
    description: '',
    crimeType: '',
    severity: 'medium',
    latitude: '',
    longitude: '',
    address: '',
    isAnonymous: true,
    reporterName: '',
    reporterEmail: '',
    reporterPhone: '',
    mediaFiles: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        error => console.log('Location access denied:', error)
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: e.target.files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('description', formData.description);
      data.append('crimeType', formData.crimeType);
      data.append('severity', formData.severity);
      data.append('latitude', formData.latitude);
      data.append('longitude', formData.longitude);
      data.append('address', formData.address);
      data.append('isAnonymous', formData.isAnonymous);
      if (!formData.isAnonymous) {
        data.append('reporterName', formData.reporterName);
        data.append('reporterEmail', formData.reporterEmail);
        data.append('reporterPhone', formData.reporterPhone);
      }

      for (let file of formData.mediaFiles) {
        data.append('media', file);
      }

      await reportAPI.createReport(data);

      setMessageType('success');
      setMessage(
        <div className="alert-content">
          <CheckCircle size={20} /> Crime report submitted successfully! Thank you for your contribution to community safety.
        </div>
      );
      setFormData({
        description: '',
        crimeType: '',
        severity: 'medium',
        latitude: '',
        longitude: '',
        address: '',
        isAnonymous: true,
        reporterName: '',
        reporterEmail: '',
        reporterPhone: '',
        mediaFiles: []
      });

      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessageType('error');
      setMessage(
        <div className="alert-content">
          <XCircle size={20} /> Error submitting report: {error.response?.data?.message || error.message}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const crimeTypes = [
    'theft',
    'assault',
    'robbery',
    'burglary',
    'accident',
    'vandalism',
    'fraud',
    'harassment',
    'other'
  ];

  return (
    <div className="report-page">
      <div className="container">
        <div className="page-header text-center">
          <h1 className="section-title justify-center"><FileEdit size={32} className="title-icon" /> Report a Crime</h1>
          <p className="section-subtitle">Help us keep your community safe by reporting incidents securely</p>
        </div>

        {message && <div className={`alert alert-${messageType}`}>{message}</div>}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-section">
            <h2><MapPin className="section-icon" size={22} /> Location Information</h2>

            <div className="form-group">
              <label htmlFor="address">Crime Location Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter the address where the crime occurred"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleInputChange}
                  step="0.0001"
                  placeholder="-40.7128"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleInputChange}
                  step="0.0001"
                  placeholder="74.0060"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2><AlertCircle className="section-icon" size={22} /> Incident Details</h2>

            <div className="form-group">
              <label htmlFor="crimeType">Type of Crime *</label>
              <select
                id="crimeType"
                name="crimeType"
                value={formData.crimeType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select crime type...</option>
                {crimeTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="severity">Severity Level *</label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the incident in detail..."
                minLength={10}
                maxLength={5000}
                required
              />
              <small>{formData.description.length}/5000 characters</small>
            </div>
          </div>

          <div className="form-section">
            <h2><Camera className="section-icon" size={22} /> Media Evidence</h2>

            <div className="form-group">
              <label htmlFor="mediaFiles">Upload Photos/Videos (Optional)</label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="mediaFiles"
                  name="mediaFiles"
                  onChange={handleFileChange}
                  multiple
                  accept="image/*,video/*"
                />
              </div>
              <small>Max 5 files, max 50MB per file</small>
            </div>
          </div>

          <div className="form-section">
            <h2><User className="section-icon" size={22} /> Your Information</h2>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="isAnonymous"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
              />
              <label htmlFor="isAnonymous">Report Anonymously (Recommended)</label>
            </div>

            {!formData.isAnonymous && (
              <div className="personal-info-box">
                <div className="form-group">
                  <label htmlFor="reporterName">Your Name</label>
                  <input
                    type="text"
                    id="reporterName"
                    name="reporterName"
                    value={formData.reporterName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reporterEmail">Email Address</label>
                  <input
                    type="email"
                    id="reporterEmail"
                    name="reporterEmail"
                    value={formData.reporterEmail}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reporterPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="reporterPhone"
                    name="reporterPhone"
                    value={formData.reporterPhone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
              <Send size={18} /> {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCrime;
