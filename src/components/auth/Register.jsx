import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLogo from '../../images/dreamestatelogoauth.png'

import './Register.css'
const Register = () => {
    const navigate = useNavigate();

    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUpperCase && hasSpecialChar;
    };

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
        setError("");
        setAlert("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation priority checks
        if (newUser.password !== newUser.confirmPassword) {
            setError('Fjalëkalimet nuk përputhen');
            setAlert("danger");
            return;
        }

        if (newUser.password.length < 8) {
            setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere');
            setAlert("danger");
            return;
        }

        if (!validatePassword(newUser.password)) {
            setError('Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe dhe një karakter special');
            setAlert("danger");
            return;
        }

        if (!newUser.username) {
            setError('Emri i përdoruesit nuk mund të jetë bosh');
            setAlert("danger");
            return;
        }

        if (!newUser.email) {
            setError('Email-i nuk mund të jetë bosh');
            setAlert("danger");
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password
            });
            navigate('/login');
        } catch (err) {
            setAlert('danger');
            if (err.response?.data === "This user already exists") {
                setError("Ky email është në përdorim");
            } else {
                setError("Gabim në regjistrim");
            }
        }
    };

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col
                    md={6}
                    className="d-none left-side left-side-register d-md-block h-100"

                >
                    
                </Col>

                <Col md={6} className="h-100 right-side right-side-register">
                    <div className="h-100 d-flex align-items-center right-side-stuff justify-content-center p-4">


                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="w-100">
                                <a href="/">
                                    <img src={AuthLogo} className="logo-auth-img" style={{ marginBottom: '3rem' }}></img>
                                </a>

                            </div>
                            <h1 className="text-center mb-4">Krijo Llogari</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 form-element">
                                    <Form.Label>Emri i përdoruesit</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={newUser.username}
                                        onChange={handleChange}
                                        placeholder="Shkruani emrin e përdoruesit"
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-element">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={newUser.email}
                                        onChange={handleChange}
                                        placeholder="Shkruani email-in"
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-element">
                                    <Form.Label>Fjalëkalimi</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={newUser.password}
                                        onChange={handleChange}
                                        placeholder="Shkruani fjalëkalimin"
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3 form-element">
                                    <Form.Label>Konfirmo fjalëkalimin</Form.Label>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={newUser.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Konfirmoni fjalëkalimin"
                                        className="shadow-sm"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="show-password"
                                        label="Shfaq fjalëkalimin"
                                        onChange={() => setShowPassword(!showPassword)}
                                        checked={showPassword}
                                    />
                                </Form.Group>

                            

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="lg">
                                        Regjistrohu
                                    </Button>
                                </div>

                                <p className="text-center mt-3">
                                    Keni një llogari?{' '}
                                    <a href="/login" className="text-decoration-none auth-link">
                                        Autentikohu
                                    </a>
                                </p>

                                {error && (
                                    <Alert variant={alert} className="mb-3">
                                        {error}
                                    </Alert>
                                )}
                            </Form>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;