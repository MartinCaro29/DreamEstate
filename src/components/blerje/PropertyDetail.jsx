import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Heart } from 'lucide-react';
import Navigation from '../landingpage/Navigation';
import PropertyMap from './PropertyMap';
import 'leaflet/dist/leaflet.css';
import './PropertyDetail.css';
import Header from '../landingpage/Header';
import Rating40 from '../../images/40star.jpg'
import Rating45 from '../../images/45star.jpg'
import Rating50 from '../../images/50star.jpg'
import FooterNav from '../landingpage/FooterNav';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const PropertyDetail = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [property, setProperty] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [formData, setFormData] = useState({
        emri: '',
        email: '',
        telefon: '',
        mesazhi: '',
    });
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setIsFavorite(false);
                return;
            }
    
            try {
                if (!property) return; // Add check for `property` here
                const response = await axios.get(`http://localhost:5000/favorites/${userId}`);
                const favoritePropertyIds = response.data.map(fav =>
                    fav.property_id?._id || fav.property_id
                );
                setIsFavorite(favoritePropertyIds.includes(property._id)); // Ensure `property._id` exists
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setIsFavorite(false);
            }
        };
    
        fetchFavoriteStatus();
    }, [property?._id]); // Make sure `property` is not null or undefined when using _id
    


    useEffect(() => {
        const fetchProperty = async () => {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setIsFavorite(false);
                return;
            }
            try {
                const response = await axios.get(`http://localhost:5000/getOneProperty/${slug}`);
                setProperty(response.data);

                // Check if the property is in favorites
                if (userId) {
                    const favResponse = await axios.get(`http://localhost:5000/favorites/${userId}`);
                    const favoritePropertyIds = favResponse.data.map(fav => fav.property_id?._id || fav.property_id);
                    setIsFavorite(favoritePropertyIds.includes(response.data._id));
                }
            } catch (error) {
                console.error('Error fetching property:', error);
            }
        };

        fetchProperty();
    }, [slug]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setIsAuthenticated(true);
            // Fetch user email if authenticated
            const fetchUserEmail = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/messages/user/${userId}`);
                    setFormData(prev => ({
                        ...prev,
                        email: response.data.email
                    }));
                } catch (error) {
                    console.error('Error fetching user email:', error);
                }
            };
            fetchUserEmail();
        }
    }, []);
    



    if (!property) return <div>Loading...</div>;

    const [location, city] = property.address ? property.address.split(',') : ['', ''];

    const getStarsRating = () => {
        switch (property.agent?.rating) {
            case 4:
                return Rating40;
                break;
            case 4.5:
                return Rating45;
                break;
            case 5:
                return Rating50;
                break;
            default:
                return null;
        }
    }
    const Rating = getStarsRating();

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
                        property_id: property._id // Fix here
                    }
                });
                setIsFavorite(false);
            } else {
                await axios.post('http://localhost:5000/addFavorite', {
                    user_id: userId,  // Use userId from localStorage
                    property_id: property._id // Fix here
                });
                setIsFavorite(true);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                setIsFavorite(true);
            } else {
                console.error('Error updating favorites:', error);
            }
        }
    };
    

    const validateForm = () => {
        const newErrors = {};

        if (!formData.emri.trim()) {
            newErrors.emri = 'Emri është i detyrueshëm';
        }

        if (!isAuthenticated && !formData.email.trim()) {
            newErrors.email = 'Email-i është i detyrueshëm';
        } else if (!isAuthenticated && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ju lutem shkruani një email të vlefshëm';
        }

        if (!formData.telefon.trim()) {
            newErrors.telefon = 'Numri i telefonit është i detyrueshëm';
        } else if (!/^\d{10,}$/.test(formData.telefon.replace(/\s/g, ''))) {
            newErrors.telefon = 'Ju lutem shkruani një numër telefoni të vlefshëm';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/addMessage', {
                property_id: property._id,
                name: formData.emri,
                email: isAuthenticated ? formData.email : formData.email,
                phone: formData.telefon,
                message: formData.mesazhi
            });
    
            setSubmitStatus('success');
            setFormData({
                emri: '',
                email: isAuthenticated ? formData.email : '',
                telefon: '',
                mesazhi: ''
            });
    
          
            setTimeout(() => {
                setSubmitStatus('');
                navigate('/blerje');
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        }
    };

    return (
        <>
            <Navigation />
            <Container className="py-5">
                <Row>
                    {/* Left column with Property details and Contact form */}
                    <Col lg={8} md={12}>
                        {/* Main Property Card */}
                        <Card className="shadow-sm mb-4">
                            <div className="position-relative">
                                <Card.Img
                                    src={`http://localhost:5000${property.image}`}
                                    alt={property.name}
                                    style={{ height: '400px', objectFit: 'cover' }}
                                />
                                <button
                                    className="position-absolute rounded-circle border-0 p-2 shadow-sm"
                                    style={{
                                        bottom: '20px',
                                        right: '20px',
                                        backgroundColor: isFavorite ? 'rgba(255, 193, 7, 0.85)' : 'white',
                                        cursor: 'pointer',
                                        zIndex: 1,
                                    }}
                                    onClick={handleFavoriteClick}
                                >
                                    <Heart className={isFavorite ? 'text-white' : 'text-secondary'} size={24} />
                                </button>
                            </div>

                            <Card.Body className="p-4" style={{ minHeight: '322px' }}>
                                <div className="d-flex align-items-center mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            className="rounded-circle bg-secondary"
                                            style={{ width: '8px', height: '8px' }}
                                        ></div>
                                        <span className="text-secondary property-category">{property.category}</span>
                                    </div>
                                </div>

                                <h2 className="mb-3 property-name">{property.name}</h2>
                                <div className="d-flex price-and-info mb-4">
                                    <h3 className="text-warning price-tag">€{property.price?.toLocaleString()}</h3>
                                    <div className="d-flex align-items-center gap-3 info-icons">
                                        <div className="d-flex align-items-center gap-1">
                                            <svg className="text-secondary" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12V9c0-1.1-.9-2-2-2h-2V4c0-.6-.4-1-1-1H9c-.6 0-1 .4-1 1v3H6c-1.1 0-2 .9-2 2v3H2v9c0 .6.4 1 1 1h18c.6 0 1-.4 1-1v-9h-2zM9 4h6v3H9V4z" />
                                            </svg>
                                            <span className="fw-medium icon-text">{property.beds}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <svg className="text-secondary" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 14h16M3 3v2h18V3M3 17v2h18v-2" />
                                            </svg>
                                            <span className="fw-medium icon-text">{property.baths}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-1">
                                            <svg className="text-secondary" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M4 4h16v16H4V4z" strokeWidth="2" />
                                                <path d="M4 12h16M12 4v16" strokeWidth="2" />
                                            </svg>
                                            <span className="fw-medium icon-text">{property.area} m²</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-left">
                                    <span className="h6 property-location">{location}, {city}</span>

                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={4} md={12}>
                        <Card className="shadow-sm mb-4">
                            {property.coordX && property.coordY && (
                                <div className="mb-0">
                                    <PropertyMap property={property} />
                                </div>
                            )}
                            <Card.Body className="p-4" style={{ minHeight: '322px' }}>
                                <Header name={'Agjenti'} />
                                <div className="d-flex align-items-center gap-3 mb-3 mt-3">
                                    <div>
                                        <h2 className="mb-1 agent-text">{property.agent?.name} {property.agent?.surname}</h2>
                                        <p className="agent-text text-secondary mb-2">{property.agent?.email}</p>
                                        <p className="mb-2 agent-text">
                                            Eksperiencë pune: {property.agent?.experience} vite
                                        </p>
                                        <h4 className="mb-1 agent-text">
                                            Telefon: {property.agent?.phone_number}
                                        </h4>
                                        <img style={{ width: '160px', height: '35px', display: 'block', marginRight: 'auto' }} src={Rating}></img>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                {/* Contact Form */}
                <Card className="shadow-sm">
                    <Card.Body className="p-4">
                        <h4 className="mb-4 form-title">Interesohuni për këtë pronë</h4>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="text"
                                    placeholder="Shkruani Emrin"
                                    value={formData.emri}
                                    onChange={(e) => setFormData({ ...formData, emri: e.target.value })}
                                    isInvalid={!!errors.emri}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emri}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="email"
                                    placeholder="Shkruani emailin"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    type="tel"
                                    placeholder="Shkruani numrin e telefonit"
                                    value={formData.telefon}
                                    onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                                    isInvalid={!!errors.telefon}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.telefon}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Shkruani Mesazhin Tuaj këtu (opsionale)"
                                    value={formData.mesazhi}
                                    onChange={(e) => setFormData({ ...formData, mesazhi: e.target.value })}
                                />
                            </Form.Group>

                            {submitStatus === 'success' && (
                                <Alert variant="success" className="mb-3">
                                    Faleminderit për mesazhin tuaj! Agjentët tanë do t'ju kontaktojnë së shpejti.
                                </Alert>
                            )}

                            {submitStatus === 'error' && (
                                <Alert variant="danger" className="mb-3">
                                    Pati një problem me dërgimin e mesazhit. Ju lutemi provoni përsëri.
                                </Alert>
                            )}

                            <Button variant="primary" type="submit" className="w-100">
                                Dërgo Mesazhin Tuaj →
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
            <FooterNav />
        </>
    );
};

export default PropertyDetail;