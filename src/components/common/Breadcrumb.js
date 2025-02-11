import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const Breadcrumb = ({ role }) => {
    const [courses, setCourses] = useState([]);
    // const navigate = useNavigate();

    // Fetch all courses from the backend
    useEffect(() => {
        axios
            .get(`${REACT_APP_API_URL}/courses`)
            .then((response) => setCourses(response.data))
            .catch((error) => console.error('Error fetching courses:', error));
    }, []);

    return (
        <div className="nav-scroller position-sticky bg-body shadow-sm" style={{ top: '0px', zIndex: 1050 }}>
            <nav className="nav container" aria-label="breadcrumb">
                <ol className="breadcrumb ms-4 mt-3">
                    {/* <li className="breadcrumb-item"><Link to="/">Courses</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">CSS 633</li> */}
                    <li className="breadcrumb-item active" aria-current="page">Courses</li>
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb;
