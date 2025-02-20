import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';
import Img1 from '../../images/dreamestateblank.jpg'
import './SellCards.css';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';
const SellForm = () => {
    
    const [formData, setFormData] = useState({
      name: '',
      image: null,
      address: '',
      city: '',
      coordX: null,
      coordY: null,
      price: '',
      beds: '',
      baths: '',
      area: '',
      category: '',
      sell_type: '',
    });
  
    const [imagePreview, setImagePreview] = useState(null);
  
    const cities = [
      "Tirane", "Durres", "Shkoder", "Fier", "Vlore", 
      "Elbasan", "Korçe", "Sarande", "Kukes", "Rrogozhine",
      "Kavaje", "Lushnje", "Tepelene", "Gjirokaster", "Permet"
    ];
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
    };
  
    const handleCoordsChange = ({ coordX, coordY }) => {
      setFormData(prev => ({ ...prev, coordX, coordY }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const submitData = {
        ...formData,
        status: 'ne verifikim',
        agent: null
      };
      console.log('Form submitted:', submitData);
    };
  
    return (
        <>
        <Navigation/>
      <Container className="py-4">
        <div className="mt-3">
        <Header name={'Shisni pronen tuaj'} ></Header>
        </div>
        <Card className="p-5 mt-4 mb-5">
        <Form onSubmit={handleSubmit}>
          <Row className="g-4">
            {/* Left Column */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Titulli</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Foto</Form.Label>
                <Form.Control
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                />
                <div className="mt-2">
                  <Image
                    src={imagePreview || Img1}
                    alt="Property preview"
                    fluid
                    className="rounded"
                    style={{ maxHeight: '185px', minHeight: '185px', objectFit: 'cover' }}
                  />
                </div>
              </Form.Group>
  
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Koordinata X</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.coordX || ''}
                      readOnly
                      placeholder="Vendosni markerin në hartë"
                    />
                  </Form.Group>
                </Col>
                <Col md={6} >
                  <Form.Group>
                    <Form.Label className="y-section">Koordinata Y</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.coordY || ''}
                      readOnly
                      placeholder="Vendosni markerin në hartë"
                    />
                  </Form.Group>
                </Col>
              </Row>
  
              <Form.Group className="mb-3">
                <Form.Label>Vendndodhja</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </Form.Group>
  
              <Form.Group className="mb-3">
                <Form.Label>Qyteti</Form.Label>
                <Form.Select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                >
                  <option value="" disabled>Zgjidhni qytetin</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Row>
              <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tipi</Form.Label>
                    <Form.Select
                      value={formData.sell_type}
                      onChange={(e) => setFormData({ ...formData, sell_type: e.target.value })}
                      required
                    >
                      <option value="" disabled>Zgjidhni tipin</option>
                      <option value="blerje">Blerje</option>
                      <option value="qera">Qera</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
  
                <Col md={6} >
                  <Form.Group>
                    <Form.Label className="category-section">Kategoria</Form.Label>
                    <Form.Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="" disabled>Zgjidhni kategorinë</option>
                      <option value="Apartament per 1 person">Apartament për 1 person</option>
                      <option value="Apartament per shume persona">Apartament për shumë persona</option>
                      <option value="Vile">Vilë</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                </Row>
            </Col>
  
            {/* Right Column */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Vendndodhja në hartë</Form.Label>
                <InteractiveMap onCoordsChange={handleCoordsChange} />
              </Form.Group>
  
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Çmimi (€)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
  
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Numri i dhomave</Form.Label>
                    <Form.Select
                      value={formData.beds}
                      onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                      required
                    >
                      <option value="" disabled>Zgjidhni</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
  
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Numri i banjove</Form.Label>
                    <Form.Select
                      value={formData.baths}
                      onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                      required
                    >
                      <option value="" disabled>Zgjidhni</option>
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
  
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Sipërfaqja (m²)</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      min="0"
                    />
                  </Form.Group>
                </Col>
  
                
              </Row>
            </Col>
  
            <Col xs={12} className="mt-4">
              <Button type="submit" variant="primary" size="lg" className="w-100">
                Ruaj pronën
              </Button>
            </Col>
          </Row>
        </Form>
        </Card>
      </Container>
      <FooterNav/>
      </>
    );
  };
  
  export default SellForm;