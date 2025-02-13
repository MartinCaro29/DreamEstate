import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Eye } from 'lucide-react';
import axios from 'axios';

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [randomListings, setRandomListings] = useState([]);

  // Fetch properties when the component is mounted
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:5000/getAllProperties');
        setProperties(response.data);
        getRandomProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  // Function to get 3 random properties and assign random views between 1000 and 3000
  const getRandomProperties = (allProperties) => {
    if (allProperties.length < 3) return; // If fewer than 3 properties, don't proceed
    
    const shuffled = [...allProperties].sort(() => 0.5 - Math.random()); // Shuffle the array
    const randomThree = shuffled.slice(0, 3); // Take the first 3 elements

    // Assign random views between 1000 and 3000
    const randomPropertiesWithViews = randomThree.map((property) => ({
      ...property,
      views: Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000, // Random views between 1000 and 3000
    }));

    setRandomListings(randomPropertiesWithViews);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {randomListings.map((listing) => (
          <div key={listing._id} className="col-md-4 col-sm-12">
            <div className="card h-100">
              <img
                src={`http://localhost:5000${listing.image}`}  // Image should be fetched directly from the API
                alt={listing.name}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column justify-content-between" style={{ textAlign: 'left' }}>
                <div>
                  <small className="text-secondary mb-2" style={{ fontSize: '0.75rem' }}>
                    {listing.category} {/* Use category or any additional detail */}
                  </small>

                  <h4 className="card-title mt-1 fs-6 mb-3" style={{ color: '#00114b' }}>
                    {listing.name}
                  </h4>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center text-secondary">
                    <Eye size={30} className="me-1" style={{ color: '#00114b' }} />
                    <small style={{ color: '#00114b' }}>{listing.views}</small> {/* Static views data */}
                  </div>
                  <span className="h4 fw-bold" style={{ color: '#face00', margin: 0 }}>
                    ${listing.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5 border-0 bg-light">
        <div className="card-body text-center py-4 d-flex flex-wrap justify-content-between">
          <div className="d-flex flex-column" style={{ textAlign: 'left' }}>
            <h2 className="fw-bold mb-0 h3" style={{ color: '#00114b' }}>
              Kerkoni per prona?
            </h2>
            <p className=" mb-2" style={{ color: '#00114b' }}>
              Jeni ne vendin e duhur!
            </p>
          </div>
          <Button
            className="mt-auto mb-auto"
            href="/blerje"
            style={{
              backgroundColor: '#face00',
              color: '#00114b',
              width: '5rem',
              height: '2.5rem',
            }}
          >
            Gjej
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListings;
