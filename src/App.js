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
import AboutUs from './components/aboutus/AboutUs';
import Contact from './components/contact/Contact';
import AccountMenu from './components/account/AccountMenu';
import AdminDashboard from './components/admin/AdminDashboard';
import VerifyProperty from './components/admin/VerifyProperty';
import UpdateProperty from './components/admin/UpdateProperty';
import AddProperty from './components/admin/AddProperty';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Import the ProtectedRoute
import { Navigate } from 'react-router-dom';


const INACTIVITY_LIMIT = 10 * 60 * 1000; 
const CHECK_INTERVAL = 10 * 1000; 

const App = () => {
    const navigate = useNavigate();
    const lastActivityRef = useRef(Date.now());
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [user, setUser] = useState(null); // Store user details
    const [role, setRole] = useState(localStorage.getItem("role")); 
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

    const fetchUser = async (userId) => {
      try {
          const response = await axios.get(`http://localhost:5000/user/${userId}`);
          const userData = response.data.data; 
          setUser(userData);
          setRole(userData.role); // Set role based on the response
          localStorage.setItem("role", userData.role); // Store role in localStorage
      } catch (error) {
          console.error("Error fetching user:", error);
      }
  };



    useEffect(() => {
        if (userId) {
            const getToken = async () => {
                await fetchRememberMeToken(userId);
            };
            getToken();
            fetchUser(userId);
        }
    }, [userId]);

    const resetActivity = () => {
        lastActivityRef.current = Date.now();
        console.log("✅ Activity detected! Resetting timer:", new Date().toLocaleTimeString());
    };
   
    useEffect(() => {
      const userId = localStorage.getItem('userId');
      const loggedOut = localStorage.getItem('loggedOut');

      // Ensure login redirection only happens if loggedOut flag is true
      if (!userId && loggedOut === 'true') {
          localStorage.removeItem('loggedOut');
          navigate('/login', { replace: true });
      }
  }, []);

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
                isAdmin: role === "admin",
               lacksRememberToken: !rememberToken,
              
            });

            if (userId && !rememberToken && role !=="admin" && timeSinceLastActivity > INACTIVITY_LIMIT) {
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
                    {/* ✅ Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/blerje" element={<Blerje />} />
                    <Route path="/qera" element={<MerrMeQera />} />
                    <Route path="/property/:slug" element={<PropertyDetail />} />
                    <Route path="/kerkoneharte" element={<FormAndMap />} />
                    <Route path="/shitje" element={<Shitje />} />
                    <Route path="/kushjemi" element={<AboutUs />} />
                    <Route path="/kontakt" element={<Contact />} />
                    <Route path="/vleresonipronen" element={<EstimatePrice />} />
                    <Route path="/login" element={userId ? <Navigate to="/" /> : <Login />} />
                    <Route path="/ndryshofjalekalimin" element={<ForgotPassword/>}/>

                    {/* ✅ Anonymous Routes */}
                    <Route element={<ProtectedRoute isAllowed={!userId} redirectTo="/" />}>
                        
                        <Route path="/register" element={<Register />} />
                    </Route>

                    {/* ✅ Authenticated Routes */}
                    <Route element={<ProtectedRoute isAllowed={!!userId} redirectTo="/login" />}>
                        <Route path="/shisnipronen" element={<SellForm />} />
                        <Route path="/llogaria" element={<AccountMenu />} />
                    </Route>

                    {/* ✅ Admin-Only Routes */}
                    <Route element={<ProtectedRoute isAllowed={role === 'admin'} redirectTo="/" />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/verify-property/:id" element={<VerifyProperty />} />
                        <Route path="/update-property/:id" element={<UpdateProperty />} />
                        <Route path="/addProperty" element={<AddProperty />} />
                    </Route>

                    {/* Redirect all unknown routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </UserContextProvider>
        </div>
  );
}

export default App;
