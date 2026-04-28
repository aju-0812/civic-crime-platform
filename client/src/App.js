import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import ReportCrime from './pages/ReportCrime';
import LiveMap from './pages/LiveMap';
import EmergencyServices from './pages/EmergencyServices';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportCrime />} />
        <Route path="/map" element={<LiveMap />} />
        <Route path="/services" element={<EmergencyServices />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
