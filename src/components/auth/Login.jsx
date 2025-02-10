import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { UserContext } from "./UserContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLogo from '../../images/dreamestatelogoauth.png';

import './Register.css';

const Login = () => {
    const { setUserInfo } = useContext(UserContext);
    const navigate = useNavigate();

    const [userLog, setUserLog] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [alert, setAlert] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setUserLog({ ...userLog, [e.target.name]: e.target.value });
        setError("");
        setAlert("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userLog.email) {
            setError('Email-i nuk mund të jetë bosh');
            setAlert("danger");
            return;
        }

        if (userLog.password.length < 8) {
            setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere');
            setAlert("danger");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login/', userLog, {
                withCredentials: true
            });
            setUserInfo(response.data);
            navigate('/');
        } catch (err) {
            setAlert('danger');
            if (err.response?.status === 404 && err.response?.data === 'User not found') {
                setError('Email-i nuk është i saktë. Ju lutem kontrolloni email-in dhe provoni përsëri.');
            } else {
                setError('Gabim në hyrje. Ju lutem kontrolloni kredencialet dhe provoni përsëri.');
            }
        }
    };

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col
                    md={6}
                    className="d-none left-side left-side-login d-md-block h-100"
                />

                <Col md={6} className="h-100 right-side right-side-login">
                    <div className="h-100 d-flex align-items-center right-side-stuff justify-content-center p-4">
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="w-100">
                                <a href="/">
                                    <img src={AuthLogo} className="logo-auth-img" style={{ marginBottom: '3rem' }} alt="Auth Logo" />
                                </a>
                            </div>
                            <h1 className="text-center mb-4">Hyrje</h1>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3 form-element">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={userLog.email}
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
                                        value={userLog.password}
                                        onChange={handleChange}
                                        placeholder="Shkruani fjalëkalimin"
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
                                        Hyr
                                    </Button>
                                </div>

                                <p className="text-center mt-3">
                                    Nuk keni një llogari?{' '}
                                    <a href="/register" className="text-decoration-none auth-link">
                                        Regjistrohu
                                    </a>
                                </p>

                                {error && (
                                    <Alert variant={alert} className="error-alert mb-3">
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

export default Login;