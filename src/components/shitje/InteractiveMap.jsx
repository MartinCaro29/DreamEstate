import React, { useState, useEffect, useRef } from 'react';

const InteractiveMap = ({ onCoordsChange, initialCoords }) => {
  const [map, setMap] = useState(null);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  // Initialize map
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
      mapRef.current = mapInstance;
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      // Handle click events to place/move marker
      mapInstance.on('click', (e) => {
        const { lat, lng } = e.latlng;
        updateMarkerPosition(lat, lng);
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

  // Function to update marker position
  const updateMarkerPosition = (lat, lng) => {
    const L = require('leaflet');
    
    // Remove existing marker if it exists
    if (markerRef.current && mapRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    // Create and add new marker
    const newMarker = L.marker([lat, lng]);
    if (mapRef.current) {
      mapRef.current.addLayer(newMarker);
      markerRef.current = newMarker;
    }

    // Send coordinates to parent component
    onCoordsChange({
      coordX: Number(lat.toFixed(6)),
      coordY: Number(lng.toFixed(6))
    });
  };

  // Effect to handle initial coordinates and updates
  useEffect(() => {
    if (initialCoords && initialCoords.coordX && initialCoords.coordY && mapRef.current) {
      updateMarkerPosition(initialCoords.coordX, initialCoords.coordY);
      
      // Center map on the marker
      mapRef.current.setView([initialCoords.coordX, initialCoords.coordY], 7);
    }
  }, [initialCoords]);

  return (
    <div id="interactive-map" style={{ height: '400px', width: '100%', borderRadius: '0.375rem' }} />
  );
};

export default InteractiveMap;