import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../pages/Welcome.css';

const slides = [
    {
        imageSrc: '/banner3.png',
    },
    {
        imageSrc: '/banner4.jpeg',
    },
    {
        imageSrc: '/banner.jpg',
    },
    // Add more slides as needed
];

const Slideshow = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isNarrowScreen, setIsNarrowScreen] = useState(false);

    const delay = 4000; // Set the time (in milliseconds) for each slide

    const nextSlide = () => {
        setCurrentSlide((currentSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        // Calculate the previous index, considering both positive and negative values
        setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
    };


    // Function to check if the screen width is below a certain threshold
    const checkScreenSize = () => {
        setIsNarrowScreen(window.innerWidth <= 1435);
    };

    useEffect(() => {
        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);


    const imageStyle = {
        width: '100%', // Adjust the width as needed
        height: '85vh',
        objectFit: 'cover', // Adjust the height as needed
        opacity: 0.6,
        transition: 'opacity 0.5s', // Add a fade transition
        borderRadius: '10px',

    };

    const overlayStyle = {
        width: '100%',
        height: '85vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#2f2b29',
        borderRadius: '10px',

    };

    const buttonStyle = {
        position: 'absolute',
        top: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        padding: '10px',
        borderRadius: '50%',
        cursor: 'pointer',
    };

    const bannerTitle = {
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'cursive',
        fontSize: isNarrowScreen ? '50px' : '70px',
        letterSpacing: '5px',
        color: 'white',
        zIndex: 1,
        maxWidth: '100%',
    };

    const bannerSubtitle = {
        position: 'absolute',
        top: '50%', // Adjust the top position as needed
        left: '50%',
        transform: 'translateX(-50%)', // Center the subtitle horizontally
        fontSize: isNarrowScreen ? '15px' : '20px',
        color: 'white',
        zIndex: 1, // Place text above the image
        width: '90%', // Set the subtitle width to 100%
        textAlign: 'center'
    };


    // Automatically change slides at the specified interval
    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, delay);

        return () => {
            clearInterval(timer);
        };
    }, [currentSlide]);

    return (
        <div className="slideshow" style={{ position: 'relative' }}>
            <div style={overlayStyle}>
                <img
                    src={slides[currentSlide].imageSrc}
                    alt={`Slide ${currentSlide + 1}`}
                    style={imageStyle}
                />
                <h1 style={bannerTitle}>Business Intelligence</h1>
                <p style={bannerSubtitle}>Analyze business information and transform it into actionable insights that inform strategic and tactical business decisions</p>
                <Link to="/smartAnalysis">
                    <button className='startButton'>Start Analysis</button>
                </Link>
                <button onClick={prevSlide} style={{ ...buttonStyle, left: '10px' }}>
                    &lt;
                </button>
                <button onClick={nextSlide} style={{ ...buttonStyle, right: '10px' }}>
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default Slideshow;
