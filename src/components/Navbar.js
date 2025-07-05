import React from 'react';
import { Link } from 'react-scroll';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link
                    to="header"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="nav-link"
                >
                    Anasayfa
                </Link>
                <Link
                    to="services"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="nav-link"
                >
                    Hizmetler
                </Link>
                <Link
                    to="contact"
                    spy={true}
                    smooth={true}
                    offset={-70}
                    duration={500}
                    className="nav-link"
                >
                    İletişim
                </Link>
            </div>
        </nav>
    );
};

export default Navbar; 