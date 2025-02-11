import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const CourseHome = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [filters, setFilters] = useState({ semester: "", year: "", format: "" });
    const [sortBy, setSortBy] = useState("");

    // Fetch all courses from the backend
    useEffect(() => {
        axios
            .get(`${REACT_APP_API_URL}/courses`)
            .then((response) => {
                setCourses(response.data);
                setFilteredCourses(response.data);
            })
            .catch((error) => console.error('Error fetching courses:', error));
    }, []);

    // Function to handle filtering
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        let filtered = courses.filter(course =>
            (newFilters.semester === "" || course.semester === newFilters.semester) &&
            (newFilters.year === "" || course.year === parseInt(newFilters.year)) &&
            (newFilters.format === "" || course.format === newFilters.format)
        );

        setFilteredCourses(filtered);
    };

    // Function to handle sorting
    const handleSortChange = (e) => {
        const sortType = e.target.value;
        setSortBy(sortType);

        let sortedCourses = [...filteredCourses];
        if (sortType === "name") {
            sortedCourses.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === "year") {
            sortedCourses.sort((a, b) => b.year - a.year); // Descending order by year
        }

        setFilteredCourses(sortedCourses);
    };

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
                    <div className="card p-3">
                        <h4>Filters</h4>

                        <div className="mb-3">
                            <label className="form-label">Semester</label>
                            <select className="form-select" name="semester" onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="Fall">Fall</option>
                                <option value="Winter">Winter</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Year</label>
                            <input
                                type="number"
                                className="form-control"
                                name="year"
                                placeholder="Enter year"
                                onChange={handleFilterChange}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Format</label>
                            <select className="form-select" name="format" onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="online">Online</option>
                                <option value="in-person">In-person</option>
                                <option value="hybrid">Hybrid</option>
                            </select>
                        </div>

                        <hr />

                        {/* Sorting */}
                        <h4>Sort By</h4>
                        <div className="mb-3">
                            <select className="form-select" onChange={handleSortChange}>
                                <option value="">None</option>
                                <option value="name">Course Name (A-Z)</option>
                                <option value="year">Year (Newest First)</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseHome;
