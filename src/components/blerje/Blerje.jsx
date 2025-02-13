import React from 'react'
import Navigation from '../landingpage/Navigation'
import BlerjeCover from './BlerjeCover'
import FooterNav from '../landingpage/FooterNav'
import Properties from './Properties'
import './Blerje.css'

const Blerje = () => {
  return (
    <div>
        <Navigation/>
        <BlerjeCover/>
        <Properties/>
        <FooterNav/>
        
    </div>
  )
}

export default Blerje
