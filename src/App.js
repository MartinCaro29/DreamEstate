import './App.css';

import React, { useState, useEffect, useRef, useContext  } from "react";
import { UserContext } from './components/auth/UserContext';
import { useNavigate } from 'react-router-dom';
import Navigation from './components/landingpage/Navigation';
import FooterNav from './components/landingpage/FooterNav';
import LandingPage from './components/landingpage/LandingPage'
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import { UserContextProvider } from './components/auth/UserContext';
import Register from './components/auth/Register';
import Blerje from './components/blerje/Blerje';
import PropertyDetail from './components/blerje/PropertyDetail';
import MerrMeQera from './components/blerje/MerrMeQera';
import FormAndMap from './components/mapsearch/FormAndMap';
import Shitje from './components/shitje/Shitje';
import SellForm from './components/shitje/SellForm';
import EstimatePrice from './components/shitje/EstimatePrice';
import ForgotPassword from './components/auth/ForgotPassword';
import axios from 'axios'

const INACTIVITY_LIMIT = 10 * 60 * 1000; 
const CHECK_INTERVAL = 10 * 1000; 

const App = () => {
    const navigate = useNavigate();
    const lastActivityRef = useRef(Date.now());
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [rememberToken, setRememberToken] = useState(null);
    

    // Fetch Remember Me Token and validate it
    const fetchRememberMeToken = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/get-remember-token/${userId}`);
            const { rememberMeToken, message, tokenAge, expiryLimit } = response.data;
            
            setRememberToken(rememberMeToken);
            
            console.log("Remember Me Token Status:", {
                token: rememberMeToken,
                age: tokenAge,
                expiryLimit
            });
            
            return rememberMeToken;
        } catch (error) {
            console.error("Error fetching remember_me_token:", error);
           
            return null;
        }
    };

    useEffect(() => {
        if (userId) {
            const getToken = async () => {
                await fetchRememberMeToken(userId);
            };
            getToken();
        }
    }, [userId]);

    const resetActivity = () => {
        lastActivityRef.current = Date.now();
        console.log("✅ Activity detected! Resetting timer:", new Date().toLocaleTimeString());
    };

    useEffect(() => {
        window.addEventListener("mousemove", resetActivity);
        window.addEventListener("keydown", resetActivity);
        window.addEventListener("focus", resetActivity);

        const checkInactivity = setInterval(() => {
            const userId = localStorage.getItem("userId");
            const now = Date.now();
            const timeSinceLastActivity = now - lastActivityRef.current;

            console.log(`⏳ Checking inactivity: ${timeSinceLastActivity / 1000}s`, {
                hasUserId: !!userId,
               lacksRememberToken: !rememberToken,
              
            });

            if (userId && !rememberToken && timeSinceLastActivity > INACTIVITY_LIMIT) {
                console.warn("⚠️ User inactive for too long and no valid remember token! Logging out...");
                localStorage.removeItem("userId");
                setUserId(null);
                navigate("/login");
            }
        }, CHECK_INTERVAL);

        return () => {
            window.removeEventListener("mousemove", resetActivity);
            window.removeEventListener("keydown", resetActivity);
            window.removeEventListener("focus", resetActivity);
            clearInterval(checkInactivity);
        };
    }, [navigate, rememberToken]);

  return (
    <div className="App">
      <UserContextProvider>

      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blerje" element={<Blerje/>} />
      <Route path="/qera" element={<MerrMeQera/>} />
      <Route path="/property/:slug" element={<PropertyDetail/>} />
      <Route path="/kerkoneharte" element={<FormAndMap/>}/>
      <Route path="/shitje" element={<Shitje/>}/>
      <Route path="/shisnipronen" element={<SellForm/>}/>
      <Route path="/vleresonipronen" element={<EstimatePrice/>}/>
      <Route path="/ndryshofjalekalimin" element={<ForgotPassword/>}/>
      </Routes>
     
      </UserContextProvider>

    </div>
  );
}

export default App;
