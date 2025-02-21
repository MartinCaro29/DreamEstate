import React, {useEffect} from 'react'
import Navigation from '../landingpage/Navigation'
import QeraCover from './QeraCover'
import FooterNav from '../landingpage/FooterNav'
import Properties from './Properties'
import './Blerje.css'

const MerrMeQera = () => {
    useEffect(() => {
        window.scrollTo(0, 0);  
      }, [])
  return (
    <div>
        <Navigation/>
        <QeraCover/>
        <Properties title={"Prona me qera"}/>
        <FooterNav/>
        
    </div>
  )
}

export default MerrMeQera
