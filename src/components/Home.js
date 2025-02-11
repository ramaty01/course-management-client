import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CourseHome = () => {
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({ semester: '', year: '', format: '', sortBy: '' });

    useEffect(() => {
        axios
            .get(`${REACT_APP_API_URL}/courses`)
            .then((response) => setCourses(response.data))
            .catch((error) => console.error('Error fetching courses:', error));
    }, []);

    const filteredCourses = courses
        .filter(course =>
            (filters.semester ? course.semester === filters.semester : true) &&
            (filters.year ? course.year.toString() === filters.year : true) &&
            (filters.format ? course.format === filters.format : true)
        )
        .sort((a, b) => {
            if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
            if (filters.sortBy === 'year') return b.year - a.year;
            return 0;
        });

    // Get unique years from course data for dropdown options
    const uniqueYears = [...new Set(courses.map(course => course.year))].sort((a, b) => b - a);


    return (
        <div className="container">

            <div className="row">
                {/* Course List (Left) */}
                <div className="col-md-9">
                    <h2>Courses <span class="badge rounded-pill text-bg-primary fs-6">{filteredCourses.length}</span>
                    </h2>

                    {filteredCourses.length > 0 ? (
                        <div className="row">
                            {filteredCourses.map((course) => (
                                <div key={course._id} className="col-md-6">
                                    <Link to={`/view-modules/${course._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="card border-info shadow-sm mb-3" style={{ cursor: 'pointer' }}>
                                            <h6 class="card-header">{course.name}</h6>
                                            <div className="card-body">
                                                {/* <h5 className="card-title">{course.name}</h5> */}
                                                <p className="card-text">{course.description}</p>
                                                <p className="text-muted"><strong>Semester:</strong> {course.semester} {course.year}</p>
                                                <p className="text-muted"><strong>Format:</strong> {course.format}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No courses available.</p>
                    )}
                </div>

                {/* Sidebar (Right) */}
                <div className="col-md-3">
                    <div className="position-sticky" style={{ top: '30px' }}>
                        <div className="card p-3 shadow-sm">
                            <h5>Filters</h5>
                            <select className="form-control mb-2" onChange={(e) => setFilters({ ...filters, semester: e.target.value })}>
                                <option value="">All Semesters</option>
                                <option value="Spring">Spring</option>
                                <option value="Fall">Fall</option>
                                <option value="Summer">Summer</option>
                            </select>

                            <select className="form-control mb-2" onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
                                <option value="">All Years</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>

                            <select className="form-control mb-2" onChange={(e) => setFilters({ ...filters, format: e.target.value })}>
                                <option value="">All Formats</option>
                                <option value="online">Online</option>
                                <option value="in-person">In-Person</option>
                                <option value="hybrid">Hybrid</option>
                            </select>

                            <h5>Sort By</h5>
                            <select className="form-control" onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
                                <option value="">None</option>
                                <option value="name">Course Name</option>
                                <option value="year">Year</option>
                            </select>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default CourseHome;
