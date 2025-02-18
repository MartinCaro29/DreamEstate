import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import PropertySearch from './PropertySearch';
import AdvancedMap from './AdvancedMap';
import PropertyCard from '../blerje/PropertyCard';
import "./FormAndMap.css"
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import MapCover from './MapCover';

const FormAndMap = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previousFilters, setPreviousFilters] = useState(null);
    
  
    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const response = await fetch('http://localhost:5000/getAllProperties');
          if (!response.ok) throw new Error('Nuk u arrit të merren pronat');
          const data = await response.json();
          const processedData = data.map(property => {
            const [location, city] = property.address.split(',').map(item => item.trim());
            return { ...property, location, city };
          });
          setProperties(processedData);
          setFilteredProperties(processedData);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchProperties();
    }, []);
  
    const handleFilterChange = (filters) => {
        const updatedFilters = { ...filters };
      
        const minPrice = updatedFilters.minPrice ?? '';
        const maxPrice = updatedFilters.maxPrice ?? '';
      
        let filtered = properties;
      
        // Apply price filter
        if (minPrice || maxPrice) {
          filtered = filtered.filter(property => {
            const propertyPrice = property.price;
            return (
              (minPrice && !maxPrice && propertyPrice >= parseFloat(minPrice)) ||
              (maxPrice && !minPrice && propertyPrice <= parseFloat(maxPrice)) ||
              (minPrice && maxPrice && propertyPrice >= parseFloat(minPrice) && propertyPrice <= parseFloat(maxPrice))
            );
          });
        }
      
        // Apply other filters
        filtered = filtered.filter(property => {
          const matchesLocation = !updatedFilters.location?.trim() || 
            property.location.toLowerCase().includes(updatedFilters.location.toLowerCase());
      
          const matchesCity = !updatedFilters.city?.trim() || 
            property.city.toLowerCase().includes(updatedFilters.city.toLowerCase());
      
          const matchesBeds = !updatedFilters.beds || 
            property.beds >= parseInt(updatedFilters.beds, 10);
      
          const matchesBaths = !updatedFilters.baths || 
            property.baths >= parseInt(updatedFilters.baths, 10);
      
          const matchesCategory = !updatedFilters.category || 
            property.category === updatedFilters.category;
      
          const matchesStatus = !updatedFilters.status || 
            property.status === updatedFilters.status;
      
          const matchesSellType = !updatedFilters.sellType || 
            property.sell_type === updatedFilters.sellType;
      
          const matchesArea = (
            (!updatedFilters.minArea || property.area >= parseInt(updatedFilters.minArea, 10)) &&
            (!updatedFilters.maxArea || property.area <= parseInt(updatedFilters.maxArea, 10))
          );
      
          // Search query filter (checks in name and description)
          const matchesSearchQuery = !updatedFilters.searchQuery?.trim() || 
            property.name.toLowerCase().includes(updatedFilters.searchQuery.toLowerCase()) ||
            property.address.toLowerCase().includes(updatedFilters.searchQuery.toLowerCase())
            
      
          return matchesLocation && matchesCity && matchesBeds && matchesBaths && matchesCategory && 
            matchesStatus && matchesSellType && matchesArea && matchesSearchQuery;
        });
      
        setFilteredProperties(filtered);
      };
      
      
      
  
    if (loading) {
      return (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Duke u ngarkuar...</span>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="alert alert-danger m-4" role="alert">
          Gabim: {error}
        </div>
      );
    }
  
    return (
    <>
    <Navigation/>
    <MapCover/>
      <Container className="py-4">
        
        <Row className="mb-4 mt-5">
          <Col md={12} lg={6}>
          
            <PropertySearch onFilterChange={handleFilterChange} />
          </Col>
          <Col md={12} lg={6}>
            <Card className="shadow-sm">
              <Card.Body className="p-0">
                <AdvancedMap properties={filteredProperties} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
  
  
        <Row>
          {filteredProperties.length === 0 ? (
            <Col xs={12}>
              <div className="text-center p-5">
                <h4 className="text-muted">Nuk u gjetën prona që përputhen me kriteret tuaja</h4>
              </div>
            </Col>
          ) : (
            filteredProperties.map(property => (
              <Col key={property._id} xs={12} md={6} lg={4} xl={3} className="mb-4">
                <PropertyCard
                  image={property.image}
                  category={property.category}
                  name={property.name}
                  location={property.location}
                  city={property.city}
                  price={property.price}
                  beds={property.beds}
                  baths={property.baths}
                  slug={property.slug}
                  area={property.area}
                  propertyId={property._id}
                />
              </Col>
            ))
          )}
        </Row>
        
      </Container>
      <FooterNav/>
      </>
    );
  };

export default FormAndMap;
