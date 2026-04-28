import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../utils/api';
import { socket, connectSocket, disconnectSocket } from '../utils/socket';
import { LayoutDashboard, TrendingUp, List, Eye, Trash2, ShieldCheck, MapPin, Search } from 'lucide-react';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [adminUser, setAdminUser] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    setAdminUser(user);

    // Fetch reports and stats
    const fetchData = async () => {
      try {
        const [reportsRes, statsRes] = await Promise.all([
          reportAPI.getReports({ limit: 500 }),
          reportAPI.getCrimeStats()
        ]);
        setReports(Array.isArray(reportsRes.data.data) ? reportsRes.data.data : []);
        setStats(statsRes.data.data || {});
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Connect to socket for real-time updates
    connectSocket();
    socket.emit('joinReports');

    socket.on('newReport', (newReport) => {
      setReports(prev => [newReport, ...prev]);
    });

    socket.on('reportUpdated', (updatedReport) => {
      setReports(prev =>
        prev.map(r => r._id === updatedReport._id ? updatedReport : r)
      );
    });

    return () => {
      socket.off('newReport');
      socket.off('reportUpdated');
      disconnectSocket();
    };
  }, [navigate]);

  const handleStatusUpdate = async () => {
    if (!selectedReport || !newStatus) return;

    try {
      await reportAPI.updateReportStatus(selectedReport._id, {
        status: newStatus,
        adminNotes
      });

      setReports(prev =>
        prev.map(r =>
          r._id === selectedReport._id
            ? { ...r, status: newStatus, adminNotes }
            : r
        )
      );

      setSelectedReport(null);
      setNewStatus('');
      setAdminNotes('');
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportAPI.deleteReport(id);
        setReports(prev => prev.filter(r => r._id !== id));
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const filteredReports = statusFilter === 'all'
    ? reports
    : reports.filter(r => r.status === statusFilter);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="section-title"><LayoutDashboard size={28} className="title-icon" /> Admin Dashboard</h1>
            <p className="section-subtitle">Welcome, <span className="highlight-user">{adminUser?.name}</span> ({adminUser?.role})</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">Total Reports</div>
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

        {/* Crime Type Stats */}
        {stats.byCrimeType && stats.byCrimeType.length > 0 && (
          <div className="crime-stats">
            <h2><TrendingUp size={22} className="section-icon" /> Crime Distribution</h2>
            <div className="stats-table">
              {stats.byCrimeType.map(item => (
                <div key={item._id} className="stat-row">
                  <span className="crime-type">{item._id}</span>
                  <span className="crime-count">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports Management */}
        <div className="reports-management">
          <div className="management-header">
            <h2><List size={22} className="section-icon" /> Reports Management</h2>
            <div className="filter-group">
              <label>Filter by Status:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All Reports</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="no-reports">
              <Search size={40} className="empty-icon" />
              <p>No reports found matching this filter.</p>
            </div>
          ) : (
            <div className="reports-table">
              {filteredReports.map(report => (
                <div key={report._id} className="report-row">
                  <div className="report-cell report-info">
                    <div className="crime-type-badge">{report.crimeType}</div>
                    <div className="report-details">
                      <p className="report-desc">{report.description.substring(0, 200)}...</p>
                      <small><MapPin size={12} /> {report.location?.address}</small>
                    </div>
                  </div>
                  <div className="report-cell">
                    <span className={`status-badge status-${report.status}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-cell">
                    <small>{new Date(report.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="report-cell actions">
                    <button
                      className="btn-small btn-view"
                      onClick={() => {
                        setSelectedReport(report);
                        setNewStatus(report.status);
                        setAdminNotes(report.adminNotes || '');
                      }}
                    >
                      <Eye size={16} /> View
                    </button>
                    <button
                      className="btn-small btn-delete"
                      onClick={() => handleDeleteReport(report._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Report Detail Modal */}
        {selectedReport && (
          <div className="modal active">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Report Details</h2>
                <button
                  className="close-btn"
                  onClick={() => setSelectedReport(null)}
                >
                  ✕
                </button>
              </div>

              <div className="report-detail">
                <div className="detail-section">
                  <h3>Crime Information</h3>
                  <p><strong>Type:</strong> {selectedReport.crimeType}</p>
                  <p><strong>Severity:</strong> {selectedReport.severity}</p>
                  <p><strong>Status:</strong> <span className={`status-badge status-${selectedReport.status}`}>{selectedReport.status}</span></p>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>
                  <p className="report-summary-text">{selectedReport.description}</p>
                </div>

                <div className="detail-section">
                  <h3>Location</h3>
                  <p><strong>Address:</strong> {selectedReport.location?.address}</p>
                  <p><strong>Coordinates:</strong> {selectedReport.location?.coordinates ? `${selectedReport.location.coordinates[1]}, ${selectedReport.location.coordinates[0]}` : 'N/A'}</p>
                </div>

                {selectedReport.mediaFiles && selectedReport.mediaFiles.length > 0 && (
                  <div className="detail-section">
                    <h3>Media Files ({selectedReport.mediaFiles.length})</h3>
                    <ul className="media-list">
                      {selectedReport.mediaFiles.map((file, idx) => {
                        const safePath = file.path?.startsWith('/') ? file.path : `/${file.path || ''}`;
                        const fileUrl = safePath.startsWith('http') ? safePath : `http://localhost:5000${safePath.replace(/\\/g, '/')}`;
                        const isImage = file.filename?.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i) || fileUrl.match(/\.(jpeg|jpg|gif|png|webp|jfif)$/i);
                        
                        return (
                          <li key={idx} style={isImage ? { background: 'transparent', padding: 0, border: 'none' } : {}}>
                            {isImage ? (
                              <img src={fileUrl} alt="Evidence attached" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain', background: '#0f172a', border: '1px solid #334155' }} />
                            ) : (
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                📎 {file.filename}
                              </a>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                <div className="detail-section">
                  <h3>Reporter Information</h3>
                  <p><strong>Anonymous:</strong> {selectedReport.isAnonymous ? 'Yes' : 'No'}</p>
                  {!selectedReport.isAnonymous && (
                    <>
                      <p><strong>Name:</strong> {selectedReport.reporterName}</p>
                      <p><strong>Email:</strong> {selectedReport.reporterEmail}</p>
                      <p><strong>Phone:</strong> {selectedReport.reporterPhone}</p>
                    </>
                  )}
                </div>

                <div className="detail-section update-section">
                  <h3>Update Status</h3>
                  <div className="form-group">
                    <label>New Status</label>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="dismissed">Dismissed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Admin Notes</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Add notes about this incident..."
                      rows="4"
                    />
                  </div>

                  <button className="btn btn-primary update-btn" onClick={handleStatusUpdate}>
                    <ShieldCheck size={18} /> Update Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
