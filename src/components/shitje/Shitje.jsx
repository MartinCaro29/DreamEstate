import React, {useEffect} from 'react'
import Navigation from '../landingpage/Navigation'
import FooterNav from '../landingpage/FooterNav'
import SellCards from './SellCards'
import SellCover from './SellCover'

const Shitje = () => {

    useEffect(() => {
        window.scrollTo(0, 0);  
      }, [])

  return (
   <>
   <Navigation/>
   <SellCover/>
   <SellCards/>
   <FooterNav/>
   </>
  )
}

export default Shitje