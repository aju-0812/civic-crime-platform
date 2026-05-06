import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocateFixed, Shield, Stethoscope, MapPin, Search } from 'lucide-react';
import '../styles/services.css';

// Fix typical Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png'
});

const userIcon = new L.DivIcon({
  className: 'custom-user-icon',
  html: `<div style="background-color: #3b82f6; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(59,130,246,0.8); animation: pulse 2s infinite;"></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

// Authentic Teardrop Map Pin for Hospitals (Red)
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Use native default blue icon for police
const policeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapCenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

const EmergencyServices = () => {
  const [userLocation, setUserLocation] = useState([28.6139, 77.2090]); // Default
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Police Station');
  const [currentAddress, setCurrentAddress] = useState('Acquiring your precise physical address...');
  const [facilities, setFacilities] = useState([]);
  const [fetchingFacilities, setFetchingFacilities] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Sync physical string address
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`);
        const data = await response.json();
        setCurrentAddress(data.display_name || "Location Tracking Active");
      } catch (err) {
        setCurrentAddress("Coordinates Acquired. Exact address temporarily unavailable.");
      }
    };
    if (!loading) fetchAddress();
  }, [userLocation, loading]);

  // Sync pins based on active tab
  useEffect(() => {
    const fetchPins = async () => {
      setFetchingFacilities(true);
      try {
        const amenityType = activeTab === 'Police Station' ? 'police' : 'hospital';
        // 15km radius (15000m) 
        const query = `[out:json][timeout:25];(node["amenity"="${amenityType}"](around:15000, ${userLocation[0]}, ${userLocation[1]});way["amenity"="${amenityType}"](around:15000, ${userLocation[0]}, ${userLocation[1]});relation["amenity"="${amenityType}"](around:15000, ${userLocation[0]}, ${userLocation[1]}););out center;`;
        
        // Using GET request to avoid CORS preflight issues on deployed Vercel apps
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        const validFacilities = data.elements
          .map(el => {
            const lat = el.lat || el.center?.lat;
            const lng = el.lon || el.center?.lon;
            if (!lat || !lng) return null;
            return {
              id: el.id,
              name: el.tags?.name || (activeTab === 'Police Station' ? 'Local Police Station' : 'Medical Hospital'),
              phone: el.tags?.phone || el.tags?.['contact:phone'] || 'Call General Emergency Services',
              lat,
              lng
            };
          })
          .filter(Boolean);
          
        // Limit to 30 pins
        setFacilities(validFacilities.slice(0, 30));
      } catch (err) {
        console.error("Facility pin sweep failed.", err);
      } finally {
        setFetchingFacilities(false);
      }
    };

    if (!loading) fetchPins();
  }, [activeTab, userLocation, loading]);

  return (
    <div className="services-page">
      <div className="container" style={{ maxWidth: '1400px' }}>
        
        <div className="page-header text-center" style={{ marginBottom: '20px' }}>
          <h1 className="section-title justify-center" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={36} className="title-icon" color="#3b82f6" fill="rgba(59, 130, 246, 0.2)" /> 
            Live Dispatch Locator
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Broadcasting accurate proximity data straight to your current coordinates.
          </p>
        </div>

        {/* Current Address Display */}
        <div className="address-box">
          <MapPin size={28} color="#3b82f6" style={{ flexShrink: 0 }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Your Accurate Tracked Location</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{currentAddress}</span>
          </div>
        </div>

        {/* Custom Header Tabs */}
        <div className="tab-buttons">
          <button 
            onClick={() => setActiveTab('Police Station')}
            className={`tab-btn ${activeTab === 'Police Station' ? 'active-police' : ''}`}
          >
            <Shield size={20} /> Display Local Police
          </button>
          
          <button 
            onClick={() => setActiveTab('Hospitals & Clinics')}
            className={`tab-btn ${activeTab === 'Hospitals & Clinics' ? 'active-hospital' : ''}`}
          >
            <Stethoscope size={20} /> Display Hospitals & Clinics
          </button>
        </div>

        {fetchingFacilities && (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
            <Search size={16} className="spinner-icon" /> Synchronizing radar data over the grid...
          </div>
        )}

        {/* Full Screen Interactive Map Embed */}
        <div className="services-map-container">
          {loading ? (
            <div className="loading" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
              <LocateFixed size={40} className="spinner-icon" color="#3b82f6" />
              <p style={{ marginTop: '15px', color: '#94a3b8', fontSize: '1.2rem' }}>Acquiring Native GPS Satellite Lock...</p>
            </div>
          ) : (
            <MapContainer center={userLocation} zoom={13} style={{ width: '100%', height: '100%' }}>
              <TileLayer
                attribution='&copy; Google Maps'
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              />
              <MapCenter center={userLocation} />
              
              <Marker position={userLocation} icon={userIcon}>
                <Popup className="service-popup">
                  <h4 style={{ margin: 0, color: '#3b82f6', textAlign: 'center' }}>You are here</h4>
                </Popup>
              </Marker>

              {facilities.map((fac) => (
                <Marker key={fac.id} position={[fac.lat, fac.lng]} icon={activeTab === 'Police Station' ? policeIcon : hospitalIcon}>
                  <Popup className="service-popup">
                    <h4 style={{ margin: 0, color: '#1e293b' }}>{fac.name}</h4>
                    <p style={{ margin: '5px 0', fontSize: '0.85rem' }}>{activeTab}</p>
                    <a href={`tel:${fac.phone}`} style={{ color: activeTab === 'Police Station' ? '#3b82f6' : '#ef4444', textDecoration: 'none', fontWeight: 'bold' }}>{fac.phone}</a>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        <style>{`
          .address-box {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid #334155;
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
            justify-content: center;
            max-width: 100%;
            overflow: hidden;
          }
          .tab-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 30px;
          }
          .tab-btn {
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: bold;
            border-radius: 30px;
            border: 1px solid #334155;
            background: #1e293b;
            color: #94a3b8;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s;
          }
          .tab-btn.active-police {
            border: 2px solid #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }
          .tab-btn.active-hospital {
            border: 2px solid #ef4444;
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
          }
          .services-map-container {
            position: relative;
            width: 100%;
            height: 65vh;
            padding: 0;
            box-shadow: 0 20px 40px rgba(0,0,0,0.5);
            border: 1px solid #334155;
            border-radius: 16px;
            overflow: hidden;
          }

          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.8); }
            70% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
            100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
          }

          /* Responsive Mobile Breakpoints */
          @media (max-width: 768px) {
            .tab-buttons {
              flex-direction: column;
              gap: 12px;
            }
            .tab-btn {
              width: 100%;
              justify-content: center;
              padding: 14px 20px;
            }
            .address-box {
              flex-direction: column;
              text-align: center;
              padding: 15px;
            }
            .services-map-container {
              height: 55vh;
              border-radius: 8px;
            }
            .section-title {
              font-size: 1.8rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default EmergencyServices;
