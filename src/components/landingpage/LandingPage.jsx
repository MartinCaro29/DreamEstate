import React, {useEffect} from 'react'
import Navigation from './Navigation';
import Karuseli from './Karuseli';
import Reviews from './Reviews';
import FooterNav from './FooterNav';

const LandingPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [])

  return (
    <div>
      <Navigation/>
      <Karuseli/>
      <Reviews/>
      <FooterNav/>
    </div>
  )
}

export default LandingPage