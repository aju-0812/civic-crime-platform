import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { LocateFixed, Shield, Stethoscope, MapPin, Search } from 'lucide-react';
import '../styles/services.css';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const EmergencyServices = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.2090 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Police Station');
  const [currentAddress, setCurrentAddress] = useState('Acquiring your precise physical address...');
  const [facilities, setFacilities] = useState([]);
  const [fetchingFacilities, setFetchingFacilities] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  
  const mapRef = useRef();

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch Address using Google Geocoder
  useEffect(() => {
    if (!isLoaded || loading) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: userLocation }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setCurrentAddress(results[0].formatted_address);
      } else {
        setCurrentAddress('Location Tracking Active');
      }
    });
  }, [userLocation, isLoaded, loading]);

  // Fetch nearby places using Google Places API
  useEffect(() => {
    if (!isLoaded || !mapRef.current || loading) return;

    setFetchingFacilities(true);
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    
    const request = {
      location: userLocation,
      radius: '10000', // 10km radius
      type: activeTab === 'Police Station' ? ['police'] : ['hospital']
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const parsedFacilities = results.map(place => ({
          id: place.place_id,
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.vicinity,
          rating: place.rating
        }));
        setFacilities(parsedFacilities);
      } else {
        setFacilities([]);
      }
      setFetchingFacilities(false);
    });
  }, [activeTab, userLocation, isLoaded, loading]);

  if (loadError) return <div className="loading text-center" style={{marginTop: '50px'}}>Error loading Google Maps. Please check your API key.</div>;

  return (
    <div className="services-page">
      <div className="container" style={{ maxWidth: '1400px' }}>
        
        <div className="page-header text-center" style={{ marginBottom: '20px' }}>
          <h1 className="section-title justify-center" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={36} className="title-icon" color="#3b82f6" fill="rgba(59, 130, 246, 0.2)" /> 
            Live Dispatch Locator
          </h1>
          <p className="section-subtitle" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>
            Broadcasting accurate proximity data straight to your current coordinates using Google Maps.
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
            onClick={() => { setActiveTab('Police Station'); setSelectedFacility(null); }}
            className={`tab-btn ${activeTab === 'Police Station' ? 'active-police' : ''}`}
          >
            <Shield size={20} /> Display Local Police
          </button>
          
          <button 
            onClick={() => { setActiveTab('Hospitals & Clinics'); setSelectedFacility(null); }}
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
          {loading || !isLoaded ? (
            <div className="loading" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
              <LocateFixed size={40} className="spinner-icon" color="#3b82f6" />
              <p style={{ marginTop: '15px', color: '#94a3b8', fontSize: '1.2rem' }}>Acquiring Native GPS Satellite Lock...</p>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={userLocation}
              zoom={13}
              onLoad={onMapLoad}
              options={{ disableDefaultUI: false, zoomControl: true }}
            >
              {/* User Location Pin */}
              <Marker 
                position={userLocation} 
                icon={{
                  path: window.google.maps.SymbolPath.CIRCLE,
                  fillColor: '#3b82f6',
                  fillOpacity: 1,
                  strokeWeight: 3,
                  strokeColor: '#ffffff',
                  scale: 8
                }}
                onClick={() => setSelectedFacility({ id: 'user', name: 'You are here', lat: userLocation.lat, lng: userLocation.lng })}
              />

              {/* Facilities Pins */}
              {facilities.map((fac) => (
                <Marker 
                  key={fac.id} 
                  position={{ lat: fac.lat, lng: fac.lng }} 
                  icon={{
                    url: activeTab === 'Police Station' 
                      ? 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
                      : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                  }}
                  onClick={() => setSelectedFacility(fac)}
                />
              ))}

              {/* Info Popup for selected pin */}
              {selectedFacility && (
                <InfoWindow
                  position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                  onCloseClick={() => setSelectedFacility(null)}
                >
                  <div style={{ padding: '5px', color: '#1e293b' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem', fontWeight: 'bold' }}>{selectedFacility.name}</h4>
                    {selectedFacility.id !== 'user' && (
                      <>
                        <p style={{ margin: '0 0 5px 0', fontSize: '0.85rem' }}>{selectedFacility.address || activeTab}</p>
                        {selectedFacility.rating && <p style={{ margin: 0, fontSize: '0.85rem', color: '#f59e0b' }}>⭐ {selectedFacility.rating} Rating</p>}
                      </>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
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
