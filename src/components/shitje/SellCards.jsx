import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './SellCards.css'
import { useNavigate } from 'react-router-dom';
import Img1 from '../../images/dreamestatecarousel1.jpg'
import Img2 from '../../images/dreamestateprice.jpg'
const SellCards = () => {
const navigate = useNavigate();
  const products = [
    {
      id: 1,
      title: 'Shisni pronen tuaj',
      image: Img1,
      buttonText: 'Shisni pronen',
      link: '/shisnipronen'
    },
    {
      id: 2,
      title: 'Vleresoni pronen tuaj',
      image: Img2,
      buttonText: 'Vleresoni pronen',
      link: '/vleresonipronen'
    }
  ];

  return (
    <Container className="py-4">
      <Row className="g-4 py-5 mt-2 mb-5">
        {products.map(product => (
          <Col key={product.id} xs={12} md={6}>
            <Card className="h-100 border rounded-4 overflow-hidden">
              <Card.Img 
                variant="top" 
                src={product.image} 
                className="bg-info"
                style={{ aspectRatio: '16/9', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="shitje-title mb-3">{product.title}</Card.Title>
                <Card.Text className="text-muted shitje-description mb-4">
                  textextextextextextextextextexte
                  xtextextextextextextextextextex
                  textextextextextextextext
                </Card.Text>
                <div className="mt-auto">
                  <Button 
                    variant="warning" 
                    className="w-100 py-2 text-dark fw-semibold"
                    onClick={() => {navigate(product.link)}}
                  >
                    {product.buttonText}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SellCards;