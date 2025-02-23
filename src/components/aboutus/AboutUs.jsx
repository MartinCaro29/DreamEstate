import React, {useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './AboutUs.css';
import Img1 from "../../images/dreamestatecarousel1.jpg";
import Img2 from "../../images/dreamestatecarousel2.jpg";
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';

const AboutUs = () => {

    useEffect(() => {
        window.scrollTo(0, 0);  
      }, [])

  return (
    <>
    <Navigation/>
    <Container className="about-us">
        <div className="mt-5 mb-2">
        <Header name={"Kush jemi ne"}/>   
        </div>
      
      
        <Row className="mt-3 g-5" style={{ margin: '50px 0' }}>
        <Col md={6} sm={12}>
        <p>
            <strong>DreamEstate</strong> është vendi ku ëndrrat tuaja për një shtëpi të re bëhen realitet. Ne jemi një kompani e përkushtuar në
            ndihmën për të gjetur pronën e përsosur për ju. Me një portofol të pasur pronash të shitjes dhe qiradhënies, agjentët tanë të
            kualifikuar janë gjithmonë të gatshëm të ofrojnë këshilla profesionale dhe asistencë të plotë në çdo hap të procesit.
          </p>
        </Col>
        <Col md={6} sm={12}>
          <img src={Img1} className="paragraph-image" alt="DreamEstate Properties" />
        </Col>
      </Row>

      <hr />

      <Row className="evenrow g-5" style={{ margin: '50px 0' }}>
        <Col md={6} sm={12}>
          <img src={Img2} className="paragraph-image" alt="DreamEstate Properties" />
        </Col>
        <Col md={6} sm={12}>
          <p>
            Me një rrjet të gjerë partnerësh dhe ekspertizë të thellë në tregun e pasurive të paluajtshme, ne ofrojmë zgjidhje të personalizuara
            për klientët tanë. Nga apartamentet moderne deri te vilat luksoze, ne garantojmë një përvojë blerjeje ose qiraje të lehtë dhe të
            sigurt. DreamEstate është zgjedhja ideale për një fillim të ri!
          </p>
        </Col>
      </Row>
    </Container>
    <FooterNav/>
    </>
  );
};

export default AboutUs;
