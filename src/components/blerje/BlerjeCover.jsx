import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Img1 from "../../images/dreamestatebuy.jpg";
import './BlerjeCover.css';

function BlerjeCover() {
    const [searchValue, setSearchValue] = useState('');
    const [selectedNavPill, setSelectedNavPill] = useState('blerje');
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(document.documentElement.clientWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = () => {
        const category = selectedNavPill || 'blerje';
        const query = searchValue.trim();
        navigate(`/${category}?q=${encodeURIComponent(query)}`);
    };

    return (
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: '0' }}>
            <div className="title-container">
                <div className="title-content">
                    <h1 style={{
                        fontSize: isMobile ? '3rem' : '5rem',
                        color: 'white',
                        marginBottom: 0
                    }}>Blini Shtepi</h1>
                    <p style={{
                        fontSize: isMobile ? '0.8rem' : '1.2rem',
                        color: 'white',
                    }}>DreamEstate ofron cmimet me te mira per te realizuar endrren tuaj!</p>
                    <ul className="nav nav-pills-buy">
                        {['Blerje', 'Shitje', 'Qera', 'Kerko ne harte'].map((pill) => {
                            const pillValue = pill.toLowerCase().replace(/\s/g, '');
                            return (
                                <li key={pillValue}>
                                    <a
                                        style={{ cursor: 'pointer' }}
                                        className={selectedNavPill === pillValue ? 'active' : ''}
                                        onClick={() => setSelectedNavPill(pillValue)}
                                    >
                                        {pill}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                    <div 
                        className="search-container-buy d-flex align-items-center"
                        style={{ 
                            maxWidth: '350px', 
                            border: '2px solid transparent', 
                            borderRadius: '0.375rem', 
                            transition: 'border 0.2s ease-in-out'
                        }}
                        onFocus={() => document.querySelector('.search-container-buy').style.border = '3px solid rgba(126, 189, 255, 0.77)'}
                        onBlur={() => document.querySelector('.search-container-buy').style.border = '3px solid transparent'}
                    >
                        <input
                            type="search"
                            className="form-control ps-2 py-1"
                            placeholder="Kerko prona..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ 
                                borderRadius: '0.375rem 0 0 0.375rem', 
                                borderRight: 'none'
                            }}
                        />
                        <button 
                            className="btn btn-primary py-1"
                            onClick={handleSearch}
                            style={{ 
                                borderRadius: '0 0.375rem 0.375rem 0', 
                                padding: '0.25rem 0.75rem'
                            }}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div className="image-container" style={{ position: 'relative', width: '100%' }}>
                <div className="dark-overlay"></div>
                <img
                    alt="DreamEstate"
                    src={Img1}
                    className="d-block w-100"
                    style={{ height:'700px', objectFit: 'cover' }}
                />
            </div>
        </div>
    );
}

export default BlerjeCover;
