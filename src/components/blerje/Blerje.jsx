import React, {useEffect} from 'react'
import Navigation from '../landingpage/Navigation'
import BlerjeCover from './BlerjeCover'
import FooterNav from '../landingpage/FooterNav'
import Properties from './Properties'
import './Blerje.css'

const Blerje = () => {

  useEffect(() => {
    window.scrollTo(0, 0);  
  }, [])

  return (
    <div>
        <Navigation/>
        <BlerjeCover/>
        <Properties title={"Prona ne shitje"}/>
        <FooterNav/>
        
    </div>
  )
}

export default Blerje
