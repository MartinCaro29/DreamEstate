import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Img1 from "../../images/dreamestatecarousel1.jpg";
import Img2 from "../../images/dreamestatecarousel2.jpg";
import Img3 from "../../images/dreamestatecarousel3.jpg";
import Img4 from "../../images/dreamestatecarousel4.jpg";
import Img5 from "../../images/dreamestatecarousel5.jpg";
import '../../index.css';
import './Karuseli.css';

function Karuseli() {
    const [searchValue, setSearchValue] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(document.documentElement.clientWidth <= 768);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ width: '100%', overflow: 'hidden', position: 'relative', zIndex: '0' }}>
            <div className="title-container">
                <div className="title-content">
                    <h1 style={{
                        fontSize: isMobile ? '3rem' : '5rem',
                        color: 'white',
                        textAlign: 'left',
                        marginBottom: 0
                    }}>DreamEstate</h1>
                    <p style={{
                        fontSize: isMobile ? '1rem' : '1.5rem',
                        color: 'white',
                        textAlign: 'left'
                    }}>Gjeni shtepine e endrrave tuaja!</p>
                    <ul className="nav nav-pills">
                        <li className="active"><a href="#">Blerje</a></li>
                        <li><a href="#">Shitje</a></li>
                        <li><a href="#">Qera</a></li>
                        <li><a href="#">Kerko ne harte</a></li>
                    </ul>
                    <div 
    className="search-container-carousel d-flex align-items-center"
    style={{ 
        maxWidth: '350px', 
        border: '2px solid transparent', 
        borderRadius: '0.375rem', 
        transition: 'border 0.2s ease-in-out'
    }}
    onFocus={() => document.querySelector('.search-container-carousel').style.border = '3px solid rgba(126, 189, 255, 0.77)'}
    onBlur={() => document.querySelector('.search-container-carousel').style.border = '3px solid transparent'}
>
    <input
        type="search"
        className="form-control ps-2 py-1"
        placeholder="Kerko prona..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ 
            paddingRight: '3.5rem',
            borderRadius: '0.375rem 0 0 0.375rem', 
            borderRight: 'none'
        }}
    />
    <button 
        className="btn btn-primary py-1"
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

            <Carousel style={{ width: '100%' }} interval={2000}>
                {[Img1, Img2, Img3, Img4, Img5].map((img, index) => (
                    <Carousel.Item key={index} className="carousel-item">
                        <div className="dark-overlay"></div>
                        <img
                            alt={`Slide ${index + 1}`}
                            src={img}
                            className="d-block w-100 carousel-img"
                            style={{ padding: 0 }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

export default Karuseli;