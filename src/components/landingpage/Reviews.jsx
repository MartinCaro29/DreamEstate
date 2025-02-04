import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import LuanB from '../../images/luanb.jpg'
import InaS from '../../images/inas.jpg'
import AltinR from '../../images/altinr.jpg'
import Header from './Header';
import PropertyListings from './PropertyListings';
const Reviews = () => {
  const testimonials = [
    {
      name: 'Luan B.',
      image: LuanB,
      text: '"DreamEstate na ndihmoi të gjejmë shtëpinë e ëndrrave tona. Nuk do ta kishim bërë pa ta!"',
      rating: 5
    },
    {
      name: 'Ina S.',
      image: InaS,
      text: '"Jam shumë e kënaqur me vitet që kalova në kontratë qeraje! Agjentët e DreamEstate u treguan shumë profesional me gjithë zemër!"',
      rating: 5
    },
    {
      name: 'Altin R.',
      image: AltinR,
      text: '"Shërbimi më ndihmoi të marr vendime të informuara për investimin tim në pronë. Jam shumë i kënaqur me rezultatet!"',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return "⭐".repeat(rating);
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="mb-3">DreamEstate - Shtëpia Juaj, Ëndrra Juaj</h1>
        <p className="lead text-muted">
          Udhëtimi juaj drejt gjetjes së shtëpisë së përsosur fillon këtu!
        </p>
        <p className="text-muted">
          Zbuloni një përgjigjedhje unike të pronave, të përshtatura për stilin dhe ëndrrat tuaja.
          Pavarësisht nëse kërkoni një apartament të vogël, një vilë luksoze apo një mundësi fitimprurëse investimi,
          DreamEstate është këtu për t'ju udhëhequr në çdo hap të rrugës.
        </p>
      </div>

      <Row className="g-4">
        {testimonials.map((testimonial, index) => (
          <Col key={index} md={4}>
            <Card className="h-100 text-center shadow-sm">
              <div className="mt-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="rounded-circle"
                  width="120"
                  height="120"
                />
              </div>
              <Card.Body style={{display:'flex', flexDirection:'column', justifyContent:"space-between"}}>
                <div>
                <div className='h3'>{testimonial.name}</div>
                <Card.Text className="text-muted mb-3">
                  {testimonial.text}
                </Card.Text>
                </div>
                <div className="text-warning mb-3">
                  {renderStars(testimonial.rating)}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
        <div >
          <Header name={"Pronat e perzgjedhura"}/>
        </div>
        <PropertyListings/>
    </Container>
  );
};

export default Reviews;