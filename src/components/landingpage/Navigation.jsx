import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Dropdown, NavDropdown } from 'react-bootstrap';
import { UserContext } from '../auth/UserContext';
import './Navigation.css';
import NavbarLogo from '../../images/dreamestatenav.png';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Blerje');
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();

  // Keep "Shitje" in this array for the first dropdown
  const allCategories = [
    'Blerje',
    'Shitje',
    'Qera',
    'Kerko ne harte'
  ];

  // Remove "Shitje" from the search dropdown
  const searchCategories = [
    'Blerje',
    'Qera',
    'Kerko ne harte'
  ];

  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUserInfo({});
    navigate('/login');
  };

  const handleSearch = () => {
    if (!selectedCategory) {
      setSelectedCategory('Blerje');
    }
    // Redirect to the new URL with category and search value
    const category = selectedCategory || 'Blerje';
    const query = searchValue.trim();

    // Navigate to the new URL with query parameters
    navigate(`/${category.toLowerCase().replace(/\s/g, '')}?q=${encodeURIComponent(query)}`);
    window.location.reload();
  };

  return (
    <div>
      <div className="bg-navy text-white py-3">
        <Container className="d-flex top-nav-container align-items-center">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="d-flex align-items-center gap-2">
              <img className="logo-img" src={NavbarLogo} style={{ width: '70px', height: '70px' }} />
              <div className="logo-text">
                <div className="h2" style={{ textAlign: 'left', margin: 0 }}>DreamEstate</div>
                <div className="h6" style={{ textAlign: 'left', margin: 0 }}>Shtepia Juaj, Endrra Juaj</div>
              </div>
              <div className="h6 motto-text" style={{ textAlign: 'left', margin: 'auto 0px', marginLeft: '20px' }}>
                Gjeni shtepine e endrrave tuaja!
              </div>
            </div>
          </a>

          <div className="social-container">
            <div className="d-flex align-items-center justify-content-around">
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
            <span className="small">Na gjeni edhe ketu</span>
          </div>
        </Container>
      </div>

      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto flex-grow-1">
              <Nav.Link href="/">Kreu</Nav.Link>
              <NavDropdown title="Prona" id="basic-nav-dropdown">
                {allCategories.map((category) => {
                  const pillValue = category.toLowerCase().replace(/\s/g, '');  // Clean up the category name
                  return (
                    <NavDropdown.Item
                      className="nav-dropdown-link"
                      key={pillValue}
                      href={`/${pillValue}`}  // Use cleaned-up value in href
                    >
                      {category}
                    </NavDropdown.Item>
                  );
                })}
              </NavDropdown>
              <Nav.Link href="/kushjemi">Kush jemi</Nav.Link>
              <Nav.Link href="/blog">Blogu</Nav.Link>
              <Nav.Link href="/kontakt">Kontakt</Nav.Link>
              {Object.keys(userInfo).length === 0 ? (
                <Nav.Link href="/login">Autentikimi</Nav.Link>
              ) : (
                <>
                  <Nav.Link href="/llogaria">Llogaria</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Dilni</Nav.Link>
                </>
              )}
            </Nav>

            <div className="d-flex search-container">
              <Dropdown>
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-basic"
                  className="border border-end-0 rounded-start rounded-0 bg-light text-dark py-1"
                  style={{ borderRadius: '0.375rem 0 0 0.375rem' }}
                >
                  {selectedCategory}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {searchCategories.map((category) => {
                    const pillValue = category.toLowerCase().replace(/\s/g, '');  // Clean up the category name
                    return (
                      <Dropdown.Item
                        key={pillValue}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>

              <div className="position-relative flex-grow-1">
                <input
                  type="search"
                  className="form-control border-start-0 rounded-0 rounded-end ps-2 py-1"
                  placeholder="Kerko prona..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  style={{
                    paddingRight: '3.5rem',
                    height: '100%',
                    borderRadius: '0 0.375rem 0.375rem 0'
                  }}
                />
                <button
                  className="btn btn-primary position-absolute top-0 end-0 h-100 py-1"
                  style={{
                    borderRadius: '0 0.375rem 0.375rem 0',
                    padding: '0.25rem 0.75rem'
                  }}
                  onClick={handleSearch}
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navigation;
