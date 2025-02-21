import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Heart } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PropertyCard = ({ 
  image,
  category,
  name,
  address,
  price,
  beds,
  baths,
  slug,
  area,
  propertyId,
  sell_type
}) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  const [location, city] = address ? address.split(',') : ['', ''];
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const userId = localStorage.getItem('userId'); // Get the userId from localStorage
      if (!userId) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/favorites/${userId}`);
        const favoritePropertyIds = response.data.map(fav => 
          fav.property_id?._id || fav.property_id
        );
        setIsFavorite(favoritePropertyIds.includes(propertyId));
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setIsFavorite(false);
      }
    };

    fetchFavoriteStatus();
  }, [propertyId]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent event bubbling

    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete('http://localhost:5000/removeFavorite', {
          data: { 
            user_id: userId,  // Use userId from localStorage
            property_id: propertyId 
          }
        });
        setIsFavorite(false);
      } else {
        await axios.post('http://localhost:5000/addFavorite', {
          user_id: userId,  // Use userId from localStorage
          property_id: propertyId
        });
        setIsFavorite(true);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // Property is already in favorites
        setIsFavorite(true);
      } else {
        console.error('Error updating favorites:', error);
      }
    }
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: '360px' }}>
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={`http://localhost:5000${image}`} 
          alt={name}
          style={{ height: '200px', objectFit: 'cover' }}
        />
        <button 
          className="position-absolute rounded-circle border-0 p-2 shadow-sm" 
          style={{
            bottom: '10px',
            right: '10px',
            backgroundColor: isFavorite ? 'rgba(255, 193, 7, 0.85)' : 'white',
            cursor: 'pointer',
            zIndex: 1
          }}
          onClick={handleFavoriteClick}
          type="button"
        >
          <Heart 
            className={isFavorite ? "text-white" : "text-secondary"} 
            size={20}
          />
        </button>
      </div>
      
      <Card.Body style={{minHeight:'244.3px'}} className="p-3 d-flex flex-column justify-content-between">
        <div>
          <div className="d-flex align-items-center mb-2">
            <div className="d-flex align-items-center gap-2">
              <div 
                className="rounded-circle bg-secondary" 
                style={{ width: '6px', height: '6px' }}
              ></div>
              <small className="text-secondary">{category}</small>
            </div>
          </div>
          
          <p className="mb-1 fw-bold card-title">{name}</p>
          <div className='mb-3 d-flex justify-content-between'>
          <Card.Text className="text-secondary small card-address">{location}</Card.Text>
          <Card.Text className="text-secondary small card-address">{city}</Card.Text>
          </div>
        </div>
        <div>
          <div className="d-flex justify-content-between card-bottom mb-1">
            <span className="h4 mb-0 text-warning fw-bold price">€{price?.toLocaleString()}{sell_type==="qera" ? " / muaj" : ""}</span>
            <div className="d-flex align-items-center gap-2 info-icons">
              <div className="d-flex align-items-center gap-1">
                <svg className="text-secondary" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12V9c0-1.1-.9-2-2-2h-2V4c0-.6-.4-1-1-1H9c-.6 0-1 .4-1 1v3H6c-1.1 0-2 .9-2 2v3H2v9c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-9h-2zM9 4h6v3H9V4z"/>
                </svg>
                <span className="small fw-medium">{beds}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <svg className="text-secondary" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 14h16M3 3v2h18V3M3 17v2h18v-2"/>
                </svg>
                <span className="small fw-medium">{baths}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <svg className="text-secondary" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 4h16v16H4V4z" strokeWidth="2"/>
                  <path d="M4 12h16M12 4v16" strokeWidth="2"/>
                </svg>
                <span className="small fw-medium">{area} m²</span>
              </div>
            </div>
          </div>

          <Button 
            variant="primary" 
            href={`/property/${slug}`}
            className="mt-2 w-100"
          >
            Blej
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PropertyCard;
