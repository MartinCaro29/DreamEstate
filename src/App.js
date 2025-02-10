
import './App.css';
import Navigation from './components/landingpage/Navigation';

import FooterNav from './components/landingpage/FooterNav';
import LandingPage from './components/landingpage/LandingPage'
import { Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import { UserContextProvider } from './components/auth/UserContext';
import Register from './components/auth/Register';
import Blerje from './components/blerje/Blerje';

function App() {
  return (
    <div className="App">
      <UserContextProvider>

      <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blerje" element={<Blerje/>} />
      </Routes>
     
      </UserContextProvider>

    </div>
  );
}

export default App;
