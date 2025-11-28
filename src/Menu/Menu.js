import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
    return (
        <nav aria-label="Main menu"
             role="navigation"
             itemScope
             itemType="https://schema.org/SiteNavigationElement"
        >
            <ul>
                <li><Link itemProp="url" to="/" aria-current="page">Home</Link></li>
                <li><Link itemProp="url" to="/about">About</Link></li>
                <li><Link itemProp="url" to="/login">Login</Link></li>
            </ul>
        </nav>
    );
}

export default Menu;