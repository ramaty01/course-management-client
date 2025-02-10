import React from 'react';
import logo from "../logo.svg";

import { Link } from 'react-router-dom';

class Header extends React.Component {
    componentDidMount() {
        // No need to do anything here for now
    }

    render() {
        return (
            <header>
                <nav className="navbar navbar-expand-lg custom-navbar">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">
                            <img src={logo} alt="Logo" width="30" height="24" className="d-inline-block align-text-top" />
                                Course Notes App
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/">Link1</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/">Link2</Link></li>
                            </ul>
                            <form className="d-flex" role="search">
                                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                                <button className="btn btn-outline-success" type="submit">Search</button>
                            </form>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;
