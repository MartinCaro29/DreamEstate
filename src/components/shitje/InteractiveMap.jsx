import React, { useState, useEffect, useRef } from 'react';

const InteractiveMap = ({ onCoordsChange }) => {
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');

      // Set up default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });

      // Initialize map centered on Albania
      const mapInstance = L.map('interactive-map').setView([41.3275, 19.8187], 7);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Handle click events to place/move marker
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker if it exists
        if (markerRef.current) {
          mapInstance.removeLayer(markerRef.current);
        }

        // Create and add new marker
        const newMarker = L.marker([lat, lng]);
        mapInstance.addLayer(newMarker);
        markerRef.current = newMarker;

        // Send coordinates to parent component
        onCoordsChange({
          coordX: Number(lat.toFixed(6)),
          coordY: Number(lng.toFixed(6))
        });
      });

      setMap(mapInstance);

      return () => {
        if (markerRef.current) {
          mapInstance.removeLayer(markerRef.current);
        }
        mapInstance.remove();
      };
    }
  }, []);

  return (
    <div id="interactive-map" style={{ height: '400px', width: '100%', borderRadius: '0.375rem' }} />
  );
};

export default InteractiveMap;