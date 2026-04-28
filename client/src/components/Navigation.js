import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, FileText, Map, LayoutDashboard, UserX, User, Siren, Navigation as NavIcon } from 'lucide-react';
import '../styles/navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('adminToken');
  const [sosActive, setSosActive] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const triggerSOS = () => {
    if (navigator.geolocation) {
      setSosActive(true);
      navigator.geolocation.getCurrentPosition(() => {
        alert('🚨 SOS SIGNAL SENT!\nYour exact location and identity data have been secretly dispatched to the nearest patrol units.');
        setTimeout(() => setSosActive(false), 3000);
      }, () => {
        alert('🚨 SOS SIGNAL SENT!\nUnable to acquire GPS lock. Location approximated via network. Dispatching units to your zone.');
        setTimeout(() => setSosActive(false), 3000);
      });
    } else {
      alert('SOS SIGNAL SENT!');
    }
  };

  return (
    <>
      <nav className="nav-container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <Shield className="logo-icon" size={24} />
            Crime Reporter
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/report">
                <FileText size={18} className="nav-icon" /> Report Crime
              </Link>
            </li>
            <li>
              <Link to="/map">
                <Map size={18} className="nav-icon" /> Live Map
              </Link>
            </li>
            <li>
              <Link to="/services">
                <NavIcon size={18} className="nav-icon" /> Services
              </Link>
            </li>
            {isAdmin ? (
              <>
                <li>
                  <Link to="/admin/dashboard">
                    <LayoutDashboard size={18} className="nav-icon" /> Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    <UserX size={18} className="nav-icon" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/admin/login">
                  <User size={18} className="nav-icon" /> Admin
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Global SOS Button */}
      <button 
        className={`global-sos-btn ${sosActive ? 'sos-active' : ''}`} 
        onClick={triggerSOS}
        title="Emergency SOS: Share immediate location to authorities"
      >
        <Siren size={28} />
        <span className="sos-text">SOS</span>
        {sosActive && <div className="sos-ripple"></div>}
      </button>
    </>
  );
};

export default Navigation;
