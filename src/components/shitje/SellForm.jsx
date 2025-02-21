import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import InteractiveMap from './InteractiveMap';
import Img1 from '../../images/dreamestateblank.jpg';
import './SellCards.css';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import Header from '../landingpage/Header';

const SellForm = () => {
    const [selectedCoords, setSelectedCoords] = useState(null);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        image: null,
        address: '',
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
    const [location, setLocation] = useState("");
    const [city, setCity] = useState("");

    const cities = [
        "Tirane", "Durres", "Shkoder", "Fier", "Vlore",
        "Elbasan", "Korçe", "Sarande", "Kukes", "Rrogozhine",
        "Kavaje", "Lushnje", "Tepelene", "Gjirokaster", "Permet"
    ];

    const validateForm = () => {
        const newErrors = {};

        // Title validation
        if (!formData.name.trim()) {
            newErrors.name = 'Titulli është i detyrueshëm';
        } else if (formData.name.length < 5 && formData.name.length > 0) {
            newErrors.name = 'Titulli duhet të ketë të paktën 5 karaktere';
            setFormData(prev => ({ ...prev, name: '' })); // Clear the name field
        }
        else if (formData.name.length ==0 ) {
            newErrors.name = 'Titulli eshte i detyrueshem';
        }

        // Image validation
        if (!formData.image) {
            newErrors.image = 'Foto është e detyrueshme';
        }

        // Location validation
        if (!location.trim()) {
            newErrors.location = 'Vendndodhja është e detyrueshme';
        }

        // City validation
        if (!city) {
            newErrors.city = 'Qyteti është i detyrueshëm';
        }

        // Coordinates validation
        if (!formData.coordX || !formData.coordY) {
            newErrors.coords = 'Ju lutem vendosni markerin në hartë';
        }

        // Price validation
        if (!formData.price) {
            newErrors.price = 'Çmimi është i detyrueshëm';
        } else if (formData.price <= 0) {
            newErrors.price = 'Çmimi duhet të jetë më i madh se 0';
        }

        // Type validation
        if (!formData.sell_type) {
            newErrors.sell_type = 'Tipi është i detyrueshëm';
        }

        // Category validation
        if (!formData.category) {
            newErrors.category = 'Kategoria është e detyrueshme';
        }

        // Beds validation
        if (!formData.beds) {
            newErrors.beds = 'Numri i dhomave është i detyrueshëm';
        }

        // Baths validation
        if (!formData.baths) {
            newErrors.baths = 'Numri i banjove është i detyrueshëm';
        }

        // Area validation
        if (!formData.area) {
            newErrors.area = 'Sipërfaqja është e detyrueshme';
        } else if (formData.area <= 0) {
            newErrors.area = 'Sipërfaqja duhet të jetë më e madhe se 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors({ ...errors, image: 'Foto duhet të jetë më e vogël se 5MB' });
                return;
            }
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
            setErrors({ ...errors, image: null });
        }
    };

    const handleCoordsChange = ({ coordX, coordY }) => {
        const newCoords = { coordX, coordY }; // Correctly format the object
        setSelectedCoords(newCoords);
        setFormData(prev => ({ ...prev, coordX, coordY }));
        if (errors.coords) {
            setErrors(prev => ({ ...prev, coords: null }));
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
          return;
        }
    
        setIsSubmitting(true);
    
        try {
          // Fix: Properly format the address as a string
          const formattedAddress = location && city ? `${location},${city}` : '';
          
          const formDataToSend = new FormData();
          
          // Append all form data
          Object.keys(formData).forEach(key => {
            if (key === 'image') {
              formDataToSend.append('image', formData.image);
            } else if (key !== 'address') { // Skip the address field from formData
              formDataToSend.append(key, formData[key]);
            }
          });
          
          // Add the properly formatted address
          formDataToSend.append('address', formattedAddress);
          formDataToSend.append('status', 'ne verifikim');
          formDataToSend.append('agent', 'null');
    
          const response = await fetch('http://localhost:5000/addProperty', {
            method: 'POST',
            body: formDataToSend,
          });
    
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Dërgimi dështoi');
          }
    
          // Reset form and navigate
          setFormData({
            name: '',
            image: null,
            address: '',
            coordX: null,
            coordY: null,
            price: '',
            beds: '',
            baths: '',
            area: '',
            category: '',
            sell_type: '',
          });
          setLocation('');
          setCity('');
          setImagePreview(null);
          navigate('/'); 
        } catch (error) {
          console.error('Submission error:', error);
          setErrors({ 
            ...errors, 
            submit: 'Pati një problem gjatë ruajtjes së pronës. Ju lutem provoni përsëri.' 
          });
        } finally {
          setIsSubmitting(false);
        }
      };

    const getInputStyle = (fieldName) => ({
        borderColor: errors[fieldName] ? 'red' : '#ced4da',
        backgroundColor: errors[fieldName] ? '#fff3f3' : 'white'
    });

    useEffect(() => {
        if (selectedCoords) {
            setFormData(prev => ({
                ...prev,
                coordX: selectedCoords.coordX,
                coordY: selectedCoords.coordY
            }));
            if (errors.coords) {
                setErrors(prev => ({ ...prev, coords: null }));
            }
        }
    }, [selectedCoords]);
    
    

    return (
        <>
            <Navigation />
            <div className="w-100 form-background-sell">
            <Container className="py-4 form-container">
                <div className="mt-3">
                    <Header name={'Shisni pronen tuaj'} ></Header>
                </div>
                <Card className="p-5 mt-4 mb-5 shadow-lg">
                    <Form onSubmit={handleSubmit}>
                        <Row className="g-4">
                            {/* Left Column */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Titulli</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: null });
                                        }}
                                        style={getInputStyle('name')}
                                        isInvalid={!!errors.name}
                                        placeholder={errors.name ? `${errors.name}` : "Vendosni titullin"}

                                    />

                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Foto
                                    </Form.Label>
                                        <Card style={{border: errors.image ? "solid 1px red" : "", backgroundColor: errors.image ? "#FFF3F3" : ""}}>
                                    <div className="custom-file" style={{display:'flex', flexWrap:'nowrap'}}>
                                        <input
                                            type="file"
                                            id="fileInput"
                                            onChange={handleImageChange}
                                            accept="image/*"
                                            className="custom-file-input d-none" // Hide the default input
                                        />
                                        <label htmlFor="fileInput" style={{textWrap:'nowrap', overflow:'hidden'}} className="btn btn-primary">
                                            Zgjidhni foto
                                        </label>
                                        <p className="ms-2 mt-auto mb-auto" style={{textWrap:'nowrap', overflow:'hidden', color:'#666666'}}>{imagePreview ? "Foto e zgjedhur" : errors.image ? "Fotoja është e detyrueshme" : "Asnjë foto e zgjedhur"}</p>
                                    </div>
</Card>
                            

                                    <div className="mt-2">
                                        <Image
                                            src={imagePreview || Img1}
                                            alt="Property preview"
                                            fluid
                                            className="rounded"
                                            style={{ maxHeight: '180px', minHeight: '180px', objectFit: 'cover' }}
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
                                                placeholder="Klikoni në hartë"
                                                style={getInputStyle('coords')}
                                                isInvalid={!!errors.coords}
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
                                                placeholder="Klikoni në hartë"
                                                style={getInputStyle('coords')}
                                                isInvalid={!!errors.coords}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Vendndodhja</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={location}
                                        onChange={(e) => {
                                            setLocation(e.target.value);
                                            if (errors.location) setErrors({ ...errors, location: null });
                                        }}
                                        
                                        style={getInputStyle('location')}
                    isInvalid={!!errors.location}
                    placeholder={errors.location ? `${errors.location}` : "Vendosni vendndodhjen"}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Qyteti</Form.Label>
                                    <Form.Select
                                        value={city}
                                        onChange={(e) => {
                                          setCity(e.target.value);
                                          if (errors.city) setErrors({ ...errors, city: null });
                                        }}
                                        className={errors.city ? "custom-select-invalid" : ""}
                                        isInvalid={!!errors.city}
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
                                                onChange={(e) => {
                                                  setFormData({ ...formData, sell_type: e.target.value });
                                                  if (errors.sell_type) setErrors({ ...errors, sell_type: null });
                                                }}
                                                className={errors.sell_type ? "custom-select-invalid" : ""}
                                                isInvalid={!!errors.sell_type}
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
                                                onChange={(e) => {
                                                  setFormData({ ...formData, category: e.target.value });
                                                  if (errors.category) setErrors({ ...errors, category: null });
                                                }}
                                                className={errors.category ? "custom-select-invalid" : ""}
                                                isInvalid={!!errors.category}
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
                                               onChange={(e) => {
                                                 setFormData({ ...formData, price: e.target.value });
                                                 if (errors.price) setErrors({ ...errors, price: null });
                                               }}
                                               style={getInputStyle('price')}
                                               isInvalid={!!errors.price}
                                               min="0"
                                               placeholder={errors.price ? `${errors.price}` : "Vendosni cmimin"}
                                            />
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Numri i dhomave</Form.Label>
                                            <Form.Select
                                                value={formData.beds}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, beds: e.target.value })
                                                    if (errors.beds) setErrors({ ...errors, beds: null });
                                                }}
                                               
                                                className={errors.beds ? "custom-select-invalid" : ""}
                                                isInvalid={!!errors.beds}
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
                                                onChange={(e) => {
                                                    setFormData({ ...formData, baths: e.target.value })
                                                    if (errors.baths) setErrors({ ...errors, baths: null });
                                                }}
                                                
                                                className={errors.baths ? "custom-select-invalid" : ""}
                                                isInvalid={!!errors.baths}
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
                                                onChange={(e) => {
                                                    setFormData({ ...formData, area: e.target.value })
                                                    if (errors.area) setErrors({ ...errors, area: null });
                                                }}
                                                style={getInputStyle('area')}
                                                isInvalid={!!errors.area}
                                                min="0"
                                                placeholder={errors.area ? `${errors.area}` : "Vendosni siperfaqen"}
                                            />
                                        </Form.Group>
                                    </Col>


                                </Row>
                            </Col>

                            <Col xs={12} className="mt-4">
                                <Button type="submit" variant="primary" size="lg" className="w-50 mt-5">
                                    Ruaj pronën
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </Container>
            </div>
            <FooterNav />
        </>
    );
};

export default SellForm;