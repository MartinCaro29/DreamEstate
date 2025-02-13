import React, { useState, useEffect } from 'react';
import { Container, Dropdown } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from './PropertyCard';
import Header from '../landingpage/Header';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  const sortOptions = [
    { value: 'date-asc', label: 'Data (Më të vjetra)' },
    { value: 'date-desc', label: 'Data (Më të reja)' },
    { value: 'price-asc', label: 'Çmimi (Më i ulët)' },
    { value: 'price-desc', label: 'Çmimi (Më i lartë)' }
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/getAllProperties');
      setProperties(response.data);
      filterProperties(response.data);  // Filter immediately after fetching
      setError(null);
    } catch (err) {
      setError('Error fetching properties');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = (allProperties) => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('q');

    if (searchQuery) {
      const filtered = allProperties.filter((property) =>
        property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(allProperties);
    }
  };

  const handleSort = (value) => {
    setSortBy(value);
    const sortedProperties = [...filteredProperties];
    
    switch (value) {
      case 'date-asc':
        sortedProperties.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'date-desc':
        sortedProperties.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'price-asc':
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    
    setFilteredProperties(sortedProperties);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center px-3 mb-4 button-header">
        <Header name={"Prona ne shitje"} />
        <Dropdown>
          <Dropdown.Toggle variant="primary" id="dropdown-sort">
            {sortBy ? `Rendit sipas: ${sortOptions.find(opt => opt.value === sortBy)?.label}` : 'Rendit sipas'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {sortOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                onClick={() => handleSort(option.value)}
                active={sortBy === option.value}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {filteredProperties.map((property) => (
            <div key={property._id} className="col-lg-4 col-md-6 col-sm-12">
              <PropertyCard
                image={property.image}
                category={property.category}
                name={property.name}
                address={property.address}
                price={property.price}
                beds={property.beds}
                baths={property.baths}
                slug={property.slug}
                area={property.area}
                propertyId={property._id}
              />
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-5">
            <h3>Nuk u gjet asnje prone me kete kerkim</h3>
          </div>
        )}
      </div>
    </Container>
  );
};

export default Properties;
