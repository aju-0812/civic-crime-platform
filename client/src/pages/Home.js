import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, AlertTriangle, ShieldCheck, EyeOff } from 'lucide-react';
import '../styles/home.css';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">Official Civic Reporting Platform</div>
          <h1>Public Safety,<br/>In Your Hands.</h1>
          <p>
            Report incidents securely, track community safety in real-time, and help law enforcement respond faster. Your voice matters.
          </p>
          <div className="button-group">
            <Link to="/report" className="btn btn-hero btn-danger">
              <ShieldAlert className="btn-icon" size={20} />
              File a Report
            </Link>
            <Link to="/map" className="btn btn-hero btn-outline-light">
              <MapPin className="btn-icon" size={20} />
              Live Incident Map
            </Link>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <div className="container">
          <div className="action-cards">
            <Link to="/report" className="action-card emergency">
              <div className="icon-wrapper error">
                <AlertTriangle size={24} />
              </div>
              <h3>Emergency</h3>
              <p>Immediate threat to life or property. Call 911 immediately if you are in danger.</p>
            </Link>
            <Link to="/report" className="action-card">
              <div className="icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Property Crime</h3>
              <p>Report theft, vandalism, or burglary securely to local authorities.</p>
            </Link>
            <Link to="/report" className="action-card">
              <div className="icon-wrapper">
                <EyeOff size={24} />
              </div>
              <h3>Anonymous Tip</h3>
              <p>Submit a secure tip without revealing your identity or personal details.</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
