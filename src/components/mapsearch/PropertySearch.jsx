import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import Header from '../landingpage/Header';

const PropertySearch = ({ onFilterChange }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const queryFromUrl = searchParams.get("q") || ""; // Get search param only once

  const initialFilters = {
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    category: '',
    status: '',
    sellType: '',
    minArea: '',
    maxArea: '',
    searchQuery: '', // Initially empty, will be set in useEffect
    city: '',
    location: ''
  };

  const cities = [
    "Tirane",
    "Durres",
    "Shkoder",
    "Fier",
    "Vlore",
    "Elbasan",
    "Korçe",
    "Sarande",
    "Kukes",
    "Rrogozhine",
    "Kavaje",
    "Lushnje",
    "Tepelene",
    "Gjirokaster",
    "Permet"
  ];

  const [filters, setFilters] = useState(initialFilters);

  // On first load, set searchQuery from URL (only once)
  useEffect(() => {
    if (queryFromUrl) {
      setFilters((prevFilters) => ({ ...prevFilters, searchQuery: queryFromUrl }));
    }
  }, []); // Runs only on mount

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (onFilterChange) {
      onFilterChange({ ...filters, [field]: value });
    }
  };

  const handleClearAll = () => {
    setFilters({ ...initialFilters, searchQuery: '' }); // Reset all except searchQuery
    if (onFilterChange) {
      onFilterChange({ ...initialFilters, searchQuery: '' });
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body style={{minHeight:'600px'}}>
        <Form>
            <Header name={'Kerko ne harte'}/>
          <Row className="mb-3 mt-5">
            <Col xs={12} className="mb-3">
            <Form.Label>Kerkoni pronen</Form.Label>
            <Form.Control
                type="text"
                placeholder="Kërko me fjalë kyçe"
                value={filters.searchQuery}
                onChange={(e) => handleInputChange('searchQuery', e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6} className="mb-3">
              <Form.Label>Qyteti</Form.Label>
              <Form.Select
                value={filters.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              >
                <option value="">Zgjidh Qytetin</option>
                {cities.map((city, index) => (
                  <option key={index} value={city}>{city}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Lokacioni</Form.Label>
              <Form.Control
                type="text"
                placeholder="Shkruaj lokacionin"
                value={filters.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4} className="mb-3">
              <Form.Label>Çmimi</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Maks"
                    value={filters.maxPrice}
                    onChange={(e) => handleInputChange('maxPrice', e.target.value)}
                  />
                </Col>
              </Row>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Label>Dhoma gjumi</Form.Label>
              <Form.Select
                value={filters.beds}
                onChange={(e) => handleInputChange('beds', e.target.value)}
              >
                <option value="">Cdo numër</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+ dhoma gjumi</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Label>Banjo</Form.Label>
              <Form.Select
                value={filters.baths}
                onChange={(e) => handleInputChange('baths', e.target.value)}
              >
                <option value="">Cdo numër</option>
                {[1, 2, 3, 4].map(num => (
                  <option key={num} value={num}>{num}+ banjo</option>
                ))}
              </Form.Select>
            </Col>
          </Row>

          <Row>
            <Col md={4} className="mb-3">
              <Form.Label>Kategoria</Form.Label>
              <Form.Select
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Të gjitha kategoritë</option>
                <option value="Apartament për 1 person">Apartament për 1 person</option>
                <option value="Apartament per shume persona">Apartament për shumë persona</option>
                <option value="Vile">Vilë</option>
              </Form.Select>
            </Col>

          

            <Col md={4} className="mb-3">
              <Form.Label>Tipi</Form.Label>
              <Form.Select
                value={filters.sellType}
                onChange={(e) => handleInputChange('sellType', e.target.value)}
              >
                <option value="">Të gjitha tipet</option>
                <option value="blerje">Blerje</option>
                <option value="qera">Qera</option>
              </Form.Select>
            </Col>

            <Col md={4} className="mb-3">
              <Form.Label>Sipërfaqja</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Min"
                    value={filters.minArea}
                    onChange={(e) => handleInputChange('minArea', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Maks"
                    value={filters.maxArea}
                    onChange={(e) => handleInputChange('maxArea', e.target.value)}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Button variant="outline-warning" onClick={handleClearAll} className="mt-3">
            Pastroji filtrat
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PropertySearch;
