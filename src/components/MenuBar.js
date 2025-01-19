import React from 'react';
import { Link } from 'react-router-dom';

function MenuBar() {
  return (
    <nav style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
      <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', fontWeight: 'bold' }}>
        Home
      </Link>
    </nav>
  );
}

export default MenuBar;
