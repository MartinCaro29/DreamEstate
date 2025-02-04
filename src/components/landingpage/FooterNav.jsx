import React from 'react'
import { Link } from 'react-router-dom'
import './FooterNav.css'
import NavbarLogo from '../../images/dreamestatenav.png'

const FooterNav = () => {
  const additionalLinks = [
    'Kush jemi',
    'Blogu', 
    'Kontakt', 
    'Login', 
    'Llogaria'
  ];

  const propertyTypes = [
    'Blerje',
    'Shitje',
    'Qera',
    'Kerko ne harte'
  ];

  return (
    <footer style={{ backgroundColor: '#00114b' }} className="text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="mb-3">DreamEstate</h5>
            <p style={{ fontSize: '0.7rem' }} className="text-light footer-description mb-1">Zbuloni nje perzgjedhje unike te pronave, te pershtatura per stilin dhe endrrat tuaja.</p>
            <p style={{ fontSize: '0.7rem' }} className="text-light footer-description">DreamEstate eshte ketu per t'ju udhehequr ne cdo hap te rruges.</p>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Lidhje te shpejta</h5>
            <ul className="list-unstyled fast-links ms-auto text-align-left">
              <li><Link to="/features" className="text-light text-decoration-none">Blerje</Link></li>
              <li><Link to="/docs" className="text-light text-decoration-none">Shitje</Link></li>
              <li><Link to="/pricing" className="text-light text-decoration-none">Qera</Link></li>
              <li><Link to="/pricing" className="text-light text-decoration-none">Kerko ne harte</Link></li>
              <li><Link to="/security" className="text-light text-decoration-none">Kush jemi</Link></li>
              <li><Link to="/security" className="text-light text-decoration-none">Blogu</Link></li>
              <li><Link to="/security" className="text-light text-decoration-none">Kontakt</Link></li>
            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h5 className="mb-3">Na ndiqni</h5>
            <div className="d-flex align-items-center justify-content-around w-75 me-auto ms-auto">
              <a href="#" className="text-white">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white">
                <i className="bi bi-twitter-x fs-5"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr className="border-secondary my-4" />
        
        <div className="d-flex align-items-center logo-and-links-container justify-content-between">
        <a href="#" style={{ textDecoration: 'none', color: 'inherit', cursor:'pointer'}} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="d-flex align-items-center gap-2">
            <img 
              className="logo-img" 
              src={NavbarLogo} 
              style={{width:'70px', height:'70px'}} 
              alt="DreamEstate Logo"
            />
            <div className="logo-text">
              <div className="h2 footer-logo-title" style={{textAlign:'left', margin:0}}>DreamEstate</div>
              <div className="h6 footer-logo-subtitle" style={{textAlign:'left', margin:0}}>Shtepia Juaj, Endrra Juaj</div>
            </div>
          </div>
          </a>
          
          <div className="d-flex align-items-center nav-links-container gap-0">
            {/* Property Type Links */}
            {propertyTypes.map((type, index) => (
              <Link 
                key={index} 
                to={`/${type.toLowerCase().replace(' ', '-')}`} 
                className="text-light text-decoration-none footer-link"
              >
                {type}
              </Link>
            ))}
          
            {/* Additional Links */}
            {additionalLinks.map((link, index) => (
              <Link 
                key={index} 
                to={`/${link.toLowerCase().replace(' ', '-')}`} 
                className="text-light text-decoration-none footer-link"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="text-center h6 mt-5">
          © {new Date().getFullYear()} DreamEstate - Te gjitha te drejtat e rezervuara.
        </div>
      </div>
    </footer>
  )
}

export default FooterNav