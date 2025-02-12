import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLogo from '../../images/dreamestatelogoauth.png';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState('register');
    const [newUser, setNewUser] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [alert, setAlert] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResendCode = async () => {
        try {
            await axios.post('http://localhost:5000/resend-verification', {
                email: newUser.email,
            });
            setResendSuccess('Kodi i verifikimit u ridërgua me sukses!');
            setCountdown(10); // Restart the countdown
            setTimeout(() => setResendSuccess(''), 3000);
        } catch (err) {
            setAlert('danger');
            if (err.response?.status === 400) {
                setError(err.response.data);
            } else {
                setError('Gabim gjatë ridërgimit të kodit. Ju lutemi provoni përsëri.');
            }
        }
    };


    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUpperCase && hasSpecialChar;
    };

    const handleChange = (e) => {
        setNewUser({ ...newUser, [e.target.name]: e.target.value });
        setError('');
        setAlert('');
    };

    const handleError = (message, alertType = 'danger') => {
        setError(message);
        setAlert(alertType);
        setTimeout(() => {
            setError('');
        }, 3000); // Clear error after 3 seconds
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!newUser.username || !newUser.email || !newUser.password || !newUser.confirmPassword) {
            handleError('Të gjitha fushat janë të detyrueshme');
            return;
        }
        if (newUser.password !== newUser.confirmPassword) {
            handleError('Fjalëkalimet nuk përputhen');
            return;
        }

        if (newUser.password.length < 8 || !validatePassword(newUser.password)) {
            handleError('Fjalëkalimi duhet të jetë të paktën 8 karaktere i gjatë, të përmbajë një shkronjë të madhe dhe një karakter special.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/register', {
                username: newUser.username,
                email: newUser.email,
                password: newUser.password
            });
            setStep('verify');
            setCountdown(10);
        } catch (err) {
            if (err.response?.status === 400) {
                handleError(err.response.data);
            } else {
                handleError('Gabim gjatë regjistrimit. Ju lutemi provoni përsëri.');
            }
        }
    };



    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        try {
            await axios.post('http://localhost:5000/verify-email', {
                email: newUser.email,
                token: verificationCode
            });
            navigate('/login');
        } catch (err) {
            if (err.response?.status === 400) {
                const errorMsg =
                    err.response.data === 'Token not found or expired.' ? 'Kodi i verifikimit nuk u gjet ose ka skaduar.' :
                        err.response.data === 'Token has expired.' ? 'Kodi i verifikimit ka skaduar.' :
                            err.response.data === 'Invalid token.' ? 'Kodi i verifikimit është i pavlefshëm.' :
                                'Kodi i verifikimit është i pasaktë ose ka skaduar.';
                handleError(errorMsg);
            } else {
                handleError('Gabim gjatë verifikimit. Ju lutemi provoni përsëri.');
            }
        } finally {
            setIsVerifying(false); // Reset verifying state
        }
    };




    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col md={6} className="d-none left-side left-side-register d-md-block h-100" />
                <Col md={6} className="h-100 right-side right-side-register">
                    <div className="h-100 d-flex align-items-center right-side-stuff justify-content-center p-4">
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="w-100">
                                <a href="/">
                                    <img src={AuthLogo} className="logo-auth-img" style={{ marginBottom: '3rem' }} alt="Auth Logo" />
                                </a>
                            </div>
                            <h1 className="text-center mb-4">{step === 'register' ? 'Krijo Llogari' : 'Verifikoni Email-in'}</h1>
                            {step === 'register' ? (
                                <Form onSubmit={handleRegister}>
                                    {/* Registration form fields remain the same */}
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
                                            type={showPassword ? 'text' : 'password'}
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
                                            type={showPassword ? 'text' : 'password'}
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
                                        Jeni te regjistruar?{' '}
                                        <a href="/login" className="text-decoration-none auth-link">
                                            Autentikohu
                                        </a>
                                    </p>
                                </Form>
                            ) : (
                                <Form onSubmit={handleVerifyEmail}>
                                    <Form.Group className="mb-3 form-element">
                                        <Form.Label>Kodi i Verifikimit</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            placeholder="Shkruani kodin e verifikimit"
                                        />
                                    </Form.Group>
                                    <div className="d-grid gap-2">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            size="lg"
                                            className="mb-3"
                                            disabled={isVerifying}
                                        >
                                            {isVerifying ? 'Duke verifikuar...' : 'Verifiko Email-in'}
                                        </Button>
                                        <Button
                                            variant="outline-primary"
                                            onClick={handleResendCode}
                                            disabled={countdown > 0}
                                        >
                                            {countdown > 0
                                                ? `Ridërgo kodin (${countdown}s)`
                                                : 'Ridërgo kodin'}
                                        </Button>
                                       
                                    </div>
                                </Form>
                            )}

                            {error && (
                                <Alert variant={alert} className="mt-3">
                                    {error}
                                </Alert>
                            )}

                            {resendSuccess && (
                                <Alert variant="success" className="mt-3">
                                    {resendSuccess}
                                </Alert>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;