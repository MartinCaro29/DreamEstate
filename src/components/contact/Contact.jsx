import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import Navigation from '../landingpage/Navigation';
import FooterNav from '../landingpage/FooterNav';
import { Card, Button, Form, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Header from '../landingpage/Header';

const Contact = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);  
      }, [])

    // State for form inputs
    const [formData, setFormData] = useState({
        email: '',
        telefon: '',
        mesazhi: ''
    });

    // State for errors & submission status
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState('');

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email-i është i detyrueshëm';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Ju lutem shkruani një email të vlefshëm';
        }

        if (!formData.mesazhi.trim()) {
            newErrors.mesazhi = 'Ju lutemi shkruani mesazhin tuaj';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/contact', {
                email: formData.email,
                subject: 'Interesim për pronë',
                message: formData.mesazhi || `Numri i telefonit: ${formData.telefon}`
            });

            if (response.status === 200) {
                setSubmitStatus('success');
                setFormData({ email: '', telefon: '', mesazhi: '' });

                // Redirect after 3 seconds
                setTimeout(() => {
                    setSubmitStatus('');
                    navigate('/blerje');
                }, 3000);
            }
        } catch (error) {
            setSubmitStatus('error');
        }
    };

    return (
        <>
            <Navigation />
            <Container className="py-4">
                <div className="mt-3 mb-3">
                    <Header name={"Kontakt"} />
                </div>

                <Card className="shadow-sm mt-5 mb-5">
                    <Card.Body className="p-4">
                        <h4 className="mb-4 form-title">Na kontaktoni</h4>
                        <Form onSubmit={handleSubmit}>

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
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control
                                    as="textarea"
                                    rows={9}
                                    placeholder="Shkruani Mesazhin Tuaj këtu"
                                    value={formData.mesazhi}
                                    onChange={(e) => setFormData({ ...formData, mesazhi: e.target.value })}
                                />
                            </Form.Group>

                            {submitStatus === 'success' && (
                                <Alert variant="success" className="mb-3">
                                    Faleminderit për mesazhin tuaj! Shërbimi do t'ju kontaktojë së shpejti.
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

export default Contact;
