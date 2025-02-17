import React, { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const PropertyMap = ({ property }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!property) return;

    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });

      if (mapRef.current) {
        mapRef.current.remove();
      }

      if (containerRef.current) {
        containerRef.current.style.height = '400px';
      }
      
      const mapInstance = L.map('property-map', {
        center: [property.coordX, property.coordY],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true
      });
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);
      
      L.marker([property.coordX, property.coordY]).addTo(mapInstance);
      
      mapRef.current = mapInstance;
      setMap(mapInstance);

      setTimeout(() => {
        mapInstance.invalidateSize();
      }, 100);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [property]);

  return (
    <div 
      className="map-container" 
      ref={containerRef}
      style={{
        height: '400px',
        marginBottom: 0,
        display: 'block'
      }}
    >
      <div 
        id="property-map" 
        style={{ 
          width: '100%', 
          height: '100%',
          borderTopLeftRadius: '0.375rem',
          borderTopRightRadius: '0.375rem',
          border: '1px solid #dee2e6',
          borderBottom: 'none'
        }} 
      />
    </div>
  );
};

export default PropertyMap;