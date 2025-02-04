import logo from './logo.svg';
import './App.css';
import Navigation from './components/landingpage/Navigation';
import Karuseli from './components/landingpage/Karuseli';
import Reviews from './components/landingpage/Reviews';
import FooterNav from './components/landingpage/FooterNav';


function App() {
  return (
    <div className="App">
      <Navigation/>
      <Karuseli/>
      <Reviews/>
      <FooterNav/>
    </div>
  );
}

export default App;
