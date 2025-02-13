import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './FooterNav.css';
import NavbarLogo from '../../images/dreamestatenav.png';
import { UserContext } from '../auth/UserContext';
const FooterNav = () => {
  // You'll need to implement actual authentication state management
  // This is just an example - replace with your actual auth state management

  const { userInfo, setUserInfo } = useContext(UserContext);
  const isAuthenticated = Object.keys(userInfo).length !== 0; // Replace this with your actual auth check

  const propertyTypes = [
    { name: 'Blerje', path: '/blerje' },
    { name: 'Shitje', path: '/shitje' },
    { name: 'Qera', path: '/qera' },
    { name: 'Kerko ne harte', path: '/kerkoneharte' },
  ];

  // Dynamic additional links based on authentication state
  const getAdditionalLinks = () => {
    const commonLinks = [
      { name: 'Kush jemi', path: '/kushjemi' },
      { name: 'Blogu', path: '/blog' },
      { name: 'Kontakt', path: '/kontakt' },
    ];

    if (isAuthenticated) {
      return [
        ...commonLinks,
        { name: 'Llogaria', path: '/llogaria' },
        
      ];
    } else {
      return [
        ...commonLinks,
        { name: 'Autentikimi', path: '/login' },
      ];
    }
  };

  const additionalLinks = getAdditionalLinks();

  
  return (
    <footer style={{ backgroundColor: '#00114b' }} className="text-light py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4 className="mb-3 footer-heading">DreamEstate</h4>
            <p style={{ fontSize: '0.7rem' }} className="text-light footer-description mb-1">
              Zbuloni nje perzgjedhje unike te pronave, te pershtatura per stilin dhe endrrat tuaja.
            </p>
            <p style={{ fontSize: '0.7rem' }} className="text-light footer-description">
              DreamEstate eshte ketu per t'ju udhehequr ne cdo hap te rruges.
            </p>
          </div>

          <div className="col-md-4 mb-4">
            <h4 className="mb-3 footer-heading">Lidhje te shpejta</h4>
            <ul className="list-unstyled fast-links ms-auto text-align-left">
              {propertyTypes.map((type, index) => (
                <li key={index}>
                  <Link to={type.path} className="text-light text-decoration-none">
                    {type.name}
                  </Link>
                </li>
              ))}
              {additionalLinks.slice(0, 3).map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-light text-decoration-none">
                    {link.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          <div className="col-md-4 mb-4">
            <h4 className="mb-3 footer-heading">Na ndiqni</h4>
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
          <a
            href="#"
            style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="d-flex align-items-center gap-2">
              <img
                className="logo-img"
                src={NavbarLogo}
                style={{ width: '70px', height: '70px' }}
                alt="DreamEstate Logo"
              />
              <div className="footer-logo-text">
                <div className="h2 footer-logo-title" style={{ textAlign: 'left', margin: 0 }}>
                  DreamEstate
                </div>
                <div className="h6 footer-logo-subtitle" style={{ textAlign: 'left', margin: 0 }}>
                  Shtepia Juaj, Endrra Juaj
                </div>
              </div>
            </div>
          </a>

          <div className="d-flex align-items-center nav-links-container gap-0">
            {propertyTypes.map((type, index) => (
              <Link key={index} to={type.path} className="text-light text-decoration-none footer-link">
                {type.name}
              </Link>
            ))}
            {additionalLinks.map((link, index) => (
              <Link key={index} to={link.path} className="text-light text-decoration-none footer-link">
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center h6 mt-5">
          © {new Date().getFullYear()} DreamEstate - Te gjitha te drejtat e rezervuara.
        </div>
      </div>
    </footer>
  );
};

export default FooterNav;