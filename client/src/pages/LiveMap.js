import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { reportAPI } from '../utils/api';
import { socket, connectSocket, disconnectSocket } from '../utils/socket';
import { Map as MapIcon, Loader2, LocateFixed, Briefcase, Frown, Wallet, Unlock, Car, AlertTriangle, CreditCard, Smartphone, HelpCircle, MapPin, Paperclip, ShieldAlert, List } from 'lucide-react';
import '../styles/map.css';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png'
});

const getCrimeMarkerIcon = (crimeType) => {
  const colors = {
    'theft': 'red',
    'assault': 'darkred',
    'robbery': 'purple',
    'burglary': 'blue',
    'accident': 'orange',
    'vandalism': 'yellow',
    'fraud': 'green',
    'harassment': 'pink',
    'other': 'gray'
  };
  const color = colors[crimeType] || 'gray';

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const LiveMap = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Fetch reports and statistics
    const fetchData = async () => {
      try {
        const reportsRes = await reportAPI.getReports({ limit: 200 });
        setReports(Array.isArray(reportsRes.data.data) ? reportsRes.data.data : []);
      } catch (error) {
        console.error('Error fetching reports:', error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        error => {
          console.warn('Geolocation error:', error);
          // Default to London if geolocation fails
          setUserLocation([51.5074, -0.1278]);
        }
      );
    } else {
      // Default fallback
      setUserLocation([51.5074, -0.1278]);
    }

    // Connect to socket for real-time updates
    connectSocket();
    socket.emit('joinReports');

    socket.on('newReport', (newReport) => {
      if (newReport && newReport._id) {
        setReports(prev => {
          // Prevent duplicates
          const exists = prev.some(r => r._id === newReport._id);
          return exists ? prev : [newReport, ...prev];
        });
      }
    });

    socket.on('reportUpdated', (updatedReport) => {
      if (updatedReport && updatedReport._id) {
        setReports(prev =>
          prev.map(r => r._id === updatedReport._id ? updatedReport : r)
        );
      }
    });

    return () => {
      socket.off('newReport');
      socket.off('reportUpdated');
      disconnectSocket();
    };
  }, []);

  const getCrimeIcon = (crimeType) => {
    switch (crimeType) {
      case 'theft': return <Briefcase size={16} />;
      case 'assault': return <Frown size={16} />;
      case 'robbery': return <Wallet size={16} />;
      case 'burglary': return <Unlock size={16} />;
      case 'accident': return <Car size={16} />;
      case 'vandalism': return <AlertTriangle size={16} />;
      case 'fraud': return <CreditCard size={16} />;
      case 'harassment': return <Smartphone size={16} />;
      case 'other':
      default: return <HelpCircle size={16} />;
    }
  };

  const statusColor = (status) => {
    const colors = {
      'pending': '#fbbf24',
      'in-progress': '#60a5fa',
      'resolved': '#4ade80',
      'dismissed': '#f87171'
    };
    return colors[status] || '#94a3b8';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <Loader2 className="spinner-icon" size={40} />
          <p>Loading crime reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="container">
        <div className="page-header text-center">
          <h1 className="section-title justify-center"><MapIcon size={32} className="title-icon" /> Live Crime Map</h1>
          <p className="section-subtitle">Real-time visualization of crime incidents in your area</p>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">Total Incidents</div>
          </div>
          <div className="stat-card">
            <div className="stat-value count-pending">{reports.filter(r => r.status === 'pending').length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value count-in-progress">{reports.filter(r => r.status === 'in-progress').length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value count-resolved">{reports.filter(r => r.status === 'resolved').length}</div>
            <div className="stat-label">Resolved</div>
          </div>
        </div>

        {/* Map */}
        <div className="map-container">
          {userLocation ? (
            <MapContainer center={userLocation} zoom={13} className="map">
              {/* Dark mode friendly map tile provider */}
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
              />
              
              {/* User location marker */}
              <Marker position={userLocation}>
                <Popup className="custom-popup">
                  <div className="popup-centered">
                    <LocateFixed size={18} color="#3b82f6" /> <strong>Your Location</strong>
                  </div>
                </Popup>
              </Marker>

              {/* Crime markers */}
              {reports.map(report => {
                if (!report.location?.coordinates) return null;
                const reportLocation = [report.location.coordinates[1], report.location.coordinates[0]];

                return (
                  <CircleMarker
                    key={report._id}
                    center={reportLocation}
                    radius={8}
                    color="darkred"
                    fillColor="red"
                    fillOpacity={0.8}
                    weight={2}
                  >
                    <Popup className="custom-popup">
                      <div className="popup-content">
                        <h4><span className="popup-icon">{getCrimeIcon(report.crimeType)}</span> {report.crimeType.toUpperCase()}</h4>
                        <p><strong>Status:</strong> <span style={{ color: statusColor(report.status), fontWeight: 'bold' }}>{report.status}</span></p>
                        <p><strong>Severity:</strong> {report.severity}</p>
                        <p className="popup-desc">{report.description.substring(0, 80)}...</p>
                        <small>Reported: {new Date(report.createdAt).toLocaleString()}</small>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          ) : (
            <div className="loading">
              <LocateFixed size={32} className="spinner-icon" />
              <p>Getting your location...</p>
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="reports-section">
          <h2><List className="section-icon" size={24} /> Recent Reports</h2>
          {reports.length === 0 ? (
            <div className="no-reports">
              <ShieldAlert size={40} className="empty-icon" />
              <p>No crime reports at this time. Stay safe!</p>
            </div>
          ) : (
            <div className="reports-list">
              {reports.slice(0, 20).map(report => (
                <div key={report._id} className="report-item">
                  <div className="report-header">
                    <div className="report-info">
                      <span className="crime-type">
                        <span className="icon-wrapper">{getCrimeIcon(report.crimeType)}</span>
                        {report.crimeType}
                      </span>
                      <span className={`report-status status-${report.status}`}>{report.status}</span>
                    </div>
                    <div className="report-meta">
                      <span className="severity" style={{ background: statusColor(report.status) }}>
                        {report.severity.toUpperCase()}
                      </span>
                      <span className="time">
                        {new Date(report.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <div className="report-body">
                    <p className="location-text"><MapPin size={14} className="inline-icon" /> {report.location?.address || 'Location not specified'}</p>
                    <p className="description-text">{report.description.substring(0, 200)}...</p>
                    {report.mediaFiles && report.mediaFiles.length > 0 && (
                      <div className="report-media">
                        {report.mediaFiles.map((file, idx) => {
                          const safePath = file.path?.startsWith('/') ? file.path : `/${file.path || ''}`;
                          const fileUrl = safePath.startsWith('http') ? safePath : `http://localhost:5000${safePath.replace(/\\/g, '/')}`;
                          const isImage = file.filename?.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i) || fileUrl.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i);
                          
                          return isImage ? (
                            <img key={idx} src={fileUrl} alt="Evidence attached" className="evidence-img" />
                          ) : (
                            <p key={idx} className="evidence-text">
                              <Paperclip size={14} className="inline-icon" /> {file.filename || 'Attached File'}
                            </p>
                          );
                        })}
                      </div>
                    )}
                    <p className="report-time">
                      Reported: {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMap;
