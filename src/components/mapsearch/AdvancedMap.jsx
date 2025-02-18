import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'react-bootstrap';

const AdvancedMap = ({ properties }) => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      
      // Set up default marker icons
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });

      // Set container height
      if (containerRef.current) {
        containerRef.current.style.height = '600px';
      }

      // Initialize map if it doesn't exist
      if (!mapRef.current) {
        // Default center coordinates for Albania
        const defaultCenter = [41.3275, 19.8187]; // Tirana coordinates
        const defaultZoom = 7;

        const mapInstance = L.map('property-map', {
          center: defaultCenter,
          zoom: defaultZoom,
          zoomControl: true,
          scrollWheelZoom: true
        });
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        mapRef.current = mapInstance;
        setMap(mapInstance);
      }

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers if properties exist
      if (properties && properties.length > 0) {
        // Calculate bounds for all properties
        const bounds = L.latLngBounds(
          properties.map(prop => [prop.coordX, prop.coordY])
        );

        // Add markers
        properties.forEach(property => {
            const [location, city] = property.address.split(',').map(item => item.trim());
            const bedText = parseInt(property.beds) !== 1 ? "dhoma" : "dhome"
          const marker = L.marker([property.coordX, property.coordY])
          
            .addTo(mapRef.current)
            .bindPopup(`
              <div>
                <h6>${property.name}</h6>
                <p>${location}, ${city}</p>
                <p>Çmimi: €${property.price.toLocaleString()}</p>
                <p>${property.beds} ${bedText}, ${property.baths} banjo</p>
                <p>${property.area} m²</p>
              </div>
            `);
          markersRef.current.push(marker);
        });

        // Fit bounds with padding if there are properties
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }

      // Force a resize after rendering
      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 100);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [properties]);

  return (
    <Card>
      <Card.Body className="p-0">
        <div 
          className="map-container" 
          ref={containerRef}
          style={{ height: '600px' }}
        >
          <div 
            id="property-map" 
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '0.375rem',
              marginTop:0
            }} 
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default AdvancedMap;