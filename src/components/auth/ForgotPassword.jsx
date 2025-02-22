import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import AuthLogo from '../../images/dreamestatelogoauth.png';
import './Auth.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { userInfo } = useContext(UserContext);
    
    const [step, setStep] = useState('email');
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [resendSuccess, setResendSuccess] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        // If user is authenticated, skip email step and request verification code
        if (userInfo?.id) {
            handleAuthenticatedReset();
        }
    }, [userInfo]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleAuthenticatedReset = async () => {
        try {
            await axios.post('http://localhost:5000/request-password-reset', {}, {
                withCredentials: true
            });
            setStep('verify');
            setCountdown(10);
        } catch (err) {
            handleError('Gabim gjatë dërgimit të kodit. Ju lutemi provoni përsëri.');
        }
    };

    const validatePassword = (password) => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        return hasUpperCase && hasSpecialChar;
    };

    const handleError = (message, alertType = 'danger') => {
        setError(message);
        setAlert(alertType);
        setTimeout(() => {
            setError('');
        }, 3000);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            handleError('Email-i është i detyrueshëm');
            return;
        }

        try {
            await axios.post('http://localhost:5000/request-password-reset', {
                email: email
            });
            setStep('verify');
            setCountdown(10);
        } catch (err) {
            if (err.response?.status === 404) {
                handleError('Ky email nuk ekziston.');
            } else {
                handleError('Gabim gjatë dërgimit të kodit. Ju lutemi provoni përsëri.');
            }
        }
    };

    const handleResendCode = async () => {
        try {
            await axios.post('http://localhost:5000/resend-verification', {
                email: email
            }, {
                withCredentials: true
            });
            setResendSuccess('Kodi i verifikimit u ridërgua me sukses!');
            setCountdown(10);
            setTimeout(() => setResendSuccess(''), 3000);
        } catch (err) {
            handleError('Gabim gjatë ridërgimit të kodit. Ju lutemi provoni përsëri.');
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setIsVerifying(true);
        try {
            await axios.post('http://localhost:5000/verify-reset-code', {
                email: email,
                token: verificationCode
            }, {
                withCredentials: true
            });
            setStep('reset');
        } catch (err) {
            const errorMsg = err.response?.data === 'Token not found or expired.' ? 'Kodi i verifikimit nuk u gjet ose ka skaduar.' :
                err.response?.data === 'Token has expired.' ? 'Kodi i verifikimit ka skaduar.' :
                err.response?.data === 'Invalid token.' ? 'Kodi i verifikimit është i pavlefshëm.' :
                'Kodi i verifikimit është i pasaktë ose ka skaduar.';
            handleError(errorMsg);
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (!passwords.password || !passwords.confirmPassword) {
            handleError('Të gjitha fushat janë të detyrueshme');
            return;
        }
        if (passwords.password !== passwords.confirmPassword) {
            handleError('Fjalëkalimet nuk përputhen');
            return;
        }
        if (passwords.password.length < 8 || !validatePassword(passwords.password)) {
            handleError('Fjalëkalimi duhet të jetë të paktën 8 karaktere i gjatë, të përmbajë një shkronjë të madhe dhe një karakter special.');
            return;
        }
    
        try {
            await axios.post('http://localhost:5000/reset-password', {
                email: email,
                password: passwords.password
            }, {
                withCredentials: true
            });
    
            // Show success message and redirect after 3 seconds
            setAlert('success');
            setError('Fjalëkalimi u ndryshua me sukses! Po ridrejtoheni...');
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            handleError('Gabim gjatë ndryshimit të fjalëkalimit. Ju lutemi provoni përsëri.');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 'email':
                return (
                    <Form onSubmit={handleEmailSubmit}>
                        <Form.Group className="mb-3 form-element">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Shkruani email-in"
                                className="shadow-sm"
                            />
                        </Form.Group>
                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit" size="lg">
                                Dërgo kodin e verifikimit
                            </Button>
                        </div>
                    </Form>
                );
            case 'verify':
                return (
                    <Form onSubmit={handleVerifyCode}>
                        <Form.Group className="mb-3 form-element">
                            <Form.Label>Kodi i Verifikimit</Form.Label>
                            <Form.Control
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Shkruani kodin e verifikimit"
                                className="shadow-sm"
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
                                {isVerifying ? 'Duke verifikuar...' : 'Verifiko Kodin'}
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
                );
            case 'reset':
                return (
                    <Form onSubmit={handlePasswordReset}>
                        <Form.Group className="mb-3 form-element">
                            <Form.Label>Fjalëkalimi i ri</Form.Label>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={passwords.password}
                                onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                                placeholder="Shkruani fjalëkalimin e ri"
                                className="shadow-sm"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3 form-element">
                            <Form.Label>Konfirmo fjalëkalimin e ri</Form.Label>
                            <Form.Control
                                type={showPassword ? 'text' : 'password'}
                                value={passwords.confirmPassword}
                                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                placeholder="Konfirmoni fjalëkalimin e ri"
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
                                Ndrysho Fjalëkalimin
                            </Button>
                        </div>
                    </Form>
                );
            default:
                return null;
        }
    };

    return (
        <Container fluid className="vh-100 p-0">
            <Row className="h-100 g-0">
                <Col md={6} className="d-none left-side left-side-login d-md-block h-100" />
                <Col md={6} className="h-100 right-side right-side-login">
                    <div className="h-100 d-flex align-items-center right-side-stuff justify-content-center p-4">
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <div className="w-100">
                                <a href="/">
                                    <img src={AuthLogo} className="logo-auth-img" style={{ marginBottom: '3rem' }} alt="Auth Logo" />
                                </a>
                            </div>
                            <h1 className="text-center mb-4">
                                {step === 'email' ? 'Rivendos Fjalëkalimin' :
                                 step === 'verify' ? 'Verifiko Email-in' :
                                 'Fjalëkalimi i Ri'}
                            </h1>
                            
                            {renderStep()}

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

                            <p className="text-center mt-3">
                                Ju kujtua fjalëkalimi?{' '}
                                <a href="/login" className="text-decoration-none auth-link">
                                    Autentikohu
                                </a>
                            </p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ForgotPassword;