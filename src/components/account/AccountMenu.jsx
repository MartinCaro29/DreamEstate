import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropertyCardWithoutHeart from './PropertyCardWithoutHeart';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';

const AccountMenu = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    created_at: ''
  });
  const [originalInfo, setOriginalInfo] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUserInfo(response.data.data);
        setOriginalInfo(response.data.data);
      } catch (error) {
        setMessage({
          text: 'Gabim gjatë marrjes së të dhënave. Ju lutemi provoni përsëri.',
          type: 'danger'
        });
      }
    };

    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:5000/favorites/${userId}`);
        setFavorites(response.data);
      } catch (error) {
        setMessage({
          text: 'Gabim gjatë marrjes së pronave të preferuara. Ju lutemi provoni përsëri.',
          type: 'danger'
        });
      }
    };

    fetchUserInfo();
    fetchFavorites();
  }, [navigate]);

  // Auto-hide alert after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer); // Cleanup on unmount or if message changes
    }
  }, [message]);

  const handleSaveChanges = async () => {
    try {
      const userId = localStorage.getItem('userId');
      // Include email_verified as 0 when the email is updated
      const response = await axios.patch(`http://localhost:5000/updateUser/${userId}`, {
        username: userInfo.username,
        email: userInfo.email,  // Send email change too
        email_verified: 0,      // Explicitly set email_verified to 0 here
      });
  
      setMessage({ text: 'Të dhënat u përditësuan me sukses!', type: 'success' });
      setIsEditing(false);
      setOriginalInfo(userInfo);
    } catch (error) {
      setMessage({ text: 'Gabim gjatë përditësimit të të dhënave.', type: 'danger' });
    }
  };
  

  const handleRevertChanges = () => {
    setUserInfo(originalInfo);
    setIsEditing(false);
  };

  return (
    <>
      <Navigation />

      <Container className="py-5 mb-5">
        <div className="mb-5">
          <Header name={"Llogaria"} />
        </div>

        <Card className="shadow">
          <Card.Header className="bg-white py-3">
            <h4 style={{ color: '#00114B' }} className="mb-0 ms-auto me-auto">Profili Im</h4>
          </Card.Header>

          <Card.Body>
            {message.text && (
              <Alert 
                variant={message.type} 
                onClose={() => setMessage({ text: '', type: '' })} 
                dismissible
              >
                {message.text}
              </Alert>
            )}

            {/* User Profile Info */}
            <Row className="mb-3 mt-4">
              <Col lg={12}>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label style={{ display: 'block' }} className="me-auto">Përdoruesi</Form.Label>
                    <Form.Control
                      type="text"
                      value={userInfo.username}
                      onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label style={{ display: 'block' }} className="me-auto">Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label style={{ display: 'block' }} className="me-auto">Anëtar që nga</Form.Label>
                    <Form.Control type="text" value={new Date(userInfo.created_at).toLocaleDateString('sq-AL')} disabled />
                  </Form.Group>

                  <div className="d-flex gap-2 justify-content-center">
                    {!isEditing ? (
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Ndrysho të Dhënat
                      </Button>
                    ) : (
                      <>
                        <Button variant="primary" onClick={handleSaveChanges}>
                          Ruaj Ndryshimet
                        </Button>
                        <Button variant="primary" onClick={handleRevertChanges}>
                          Rikthe Ndryshimet
                        </Button>
                      </>
                    )}
                    <Button variant="primary" href={'/ndryshofjalekalimin'}>
                        Harruat fjalëkalimin?
                      </Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>

          {/* Favorite Properties Section */}
          <Card.Header className="bg-white py-3 mt-3">
            <div className="d-flex justify-content-center">
              <h4 style={{ color: '#00114B', margin: 0 }}>Pronat e Preferuara</h4>
            </div>
          </Card.Header>

          <Card.Body className="mb-4 mt-4">
            <Row>
              <Col lg={12}>
                {favorites.length === 0 ? (
                  <Alert variant="warning">Nuk keni asnjë pronë të preferuar ende.</Alert>
                ) : (
                  <Row xs={1} md={3} className="g-4">
                    {favorites.map((favorite) => (
                      <Col key={favorite._id}>
                        <PropertyCardWithoutHeart {...favorite.property_id} />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      <FooterNav />
    </>
  );
};

export default AccountMenu;
