import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../logo.svg";

const Header = () => {

    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        window.location.href = '/course-management-client';
    };

    return (
        <header>
            <nav className="navbar navbar-expand-lg custom-navbar">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
                        Course Notes App
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item"><Link className="nav-link" to="/">Courses</Link></li>
                            {role === 'admin' && (
                                <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                            )}
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                        {/* Sign Out Button */}
                        <button onClick={handleSignOut} className="btn btn-danger ms-2">Sign Out</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;
