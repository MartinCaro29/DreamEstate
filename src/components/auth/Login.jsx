import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { UserContext } from './UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthLogo from '../../images/dreamestatelogoauth.png';
import './Auth.css';

const Login = () => {
  const { setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const [step, setStep] = useState('login');
  const [userLog, setUserLog] = useState({ email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState('');

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (e) => {
    setUserLog({ ...userLog, [e.target.name]: e.target.value });
    setError('');
    setAlert('');
  };

  const handleError = (message, alertType = 'danger') => {
    setError(message);
    setAlert(alertType);
    setTimeout(() => setError(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userLog.email) {
      handleError('Email-i nuk mund të jetë bosh');
      return;
    }
    if (userLog.password.length < 8) {
      handleError('Fjalëkalimi duhet të ketë të paktën 8 karaktere');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/login/', userLog, {
        withCredentials: true,
      });
  
      if (response.data.needsVerification) {
        setStep('verify');
        setCountdown(10);
        return;
      }
  
      setUserInfo(response.data);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setAlert('danger');
      handleError('Email-i ose fjalëkalimi nuk janë të sakta. Ju lutem kontrolloni dhe provoni përsëri.');
    }
  };
  
  
  const [isVerifying, setIsVerifying] = useState(false); // New state for button disable

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setIsVerifying(true); // Disable the button and show loading state
    try {
      const response = await axios.post('http://localhost:5000/verify-email', {
        email: userLog.email,
        token: verificationCode,
      });
  
      // Assuming the server responds with the user data after successful verification
      setUserInfo(response.data);
      navigate('/'); // Redirect to the home page
    } catch (err) {
      setIsVerifying(false); // Re-enable the button on failure
      const errorMsg =
        err.response?.data === 'Token not found or expired.' ? 'Kodi i verifikimit nuk u gjet ose ka skaduar.' :
        err.response?.data === 'Token has expired.' ? 'Kodi i verifikimit ka skaduar.' :
        err.response?.data === 'Invalid token.' ? 'Kodi i verifikimit është i pavlefshëm.' :
        'Gabim gjatë verifikimit. Ju lutemi provoni përsëri.';
      handleError(errorMsg);
    }
  };
  

  const handleResendCode = async () => {
    try {
      await axios.post('http://localhost:5000/resend-verification', {
        email: userLog.email,
      });
      setResendSuccess('Kodi i verifikimit u ridërgua me sukses!');
      setCountdown(10);
      setTimeout(() => setResendSuccess(''), 3000);
    } catch (err) {
      handleError('Gabim gjatë ridërgimit të kodit. Ju lutemi provoni përsëri.');
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
              <h1 className="text-center mb-4">{step === 'login' ? 'Hyrje' : 'Verifikoni Email-in'}</h1>
              {step === 'login' ? (
  <Form onSubmit={handleSubmit}>
    {/* Login Form */}
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
        type={showPassword ? 'text' : 'password'}
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
      <Button variant="outline-primary" onClick={handleResendCode} disabled={countdown > 0}>
        {countdown > 0 ? `Ridërgo kodin (${countdown}s)` : 'Ridërgo kodin'}
      </Button>
      <Button variant="link" className="text-decoration-none auth-link" onClick={() => setStep('login')}>
        Kthehu te Hyrja
      </Button>
    </div>
  </Form>
  
)}
              {error && <Alert variant={alert} className="mt-3">{error}</Alert>}
              {resendSuccess && <Alert variant="success" className="mt-3">{resendSuccess}</Alert>}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
