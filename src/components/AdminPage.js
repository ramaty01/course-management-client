import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AdminPage = ({ role }) => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState("");
    const [modules, setModules] = useState({});
    const [newModule, setNewModule] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchCourses();
    }, []);

    // Fetch Courses and their Modules
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${REACT_APP_API_URL}/courses`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(response.data);

            // Fetch Modules for each Course
            const modulesData = {};
            for (const course of response.data) {
                const moduleResponse = await axios.get(`${REACT_APP_API_URL}/courses/${course._id}/modules`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                modulesData[course._id] = moduleResponse.data;
            }
            setModules(modulesData);
        } catch (err) {
            setError("Failed to load courses.");
        } finally {
            setLoading(false);
        }
    };

    // Add Course
    const handleAddCourse = async () => {
        if (!newCourse.trim()) return;
        try {
            const response = await axios.post(
                `${REACT_APP_API_URL}/courses`,
                { name: newCourse },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourses([...courses, response.data]);
            setNewCourse("");
        } catch (error) {
            alert("Failed to add course.");
        }
    };

    // Delete Course
    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axios.delete(`${REACT_APP_API_URL}/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourses(courses.filter((course) => course._id !== courseId));
        } catch (error) {
            alert("Failed to delete course.");
        }
    };

    // Add Module
    const handleAddModule = async (courseId) => {
        if (!newModule[courseId]?.trim()) return;
        try {
            const response = await axios.post(
                `${REACT_APP_API_URL}/courses/${courseId}/modules`,
                { name: newModule[courseId] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setModules({
                ...modules,
                [courseId]: [...(modules[courseId] || []), response.data],
            });
            setNewModule({ ...newModule, [courseId]: "" });
        } catch (error) {
            alert("Failed to add module.");
        }
    };

    // Delete Module
    const handleDeleteModule = async (courseId, moduleId) => {
        if (!window.confirm("Are you sure you want to delete this module?")) return;
        try {
            await axios.delete(`${REACT_APP_API_URL}/modules/${moduleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModules({
                ...modules,
                [courseId]: modules[courseId].filter((mod) => mod._id !== moduleId),
            });
        } catch (error) {
            alert("Failed to delete module.");
        }
    };

    if (loading) return <p>Loading courses...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2>Admin Panel - Course Management</h2>

            {/* Add Course Section */}
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="New Course Name"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleAddCourse}>
                    Add Course
                </button>
            </div>

            {/* List Courses */}
            <ul className="list-group">
                {courses.map((course) => (
                    <li key={course._id} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                            <span>{course.name}</span>
                            <div>
                                <button
                                    className="btn btn-danger btn-sm me-2"
                                    onClick={() => handleDeleteCourse(course._id)}
                                >
                                    Delete Course
                                </button>
                                <Link to={`/admin/modules/${course._id}`} className="btn btn-secondary btn-sm">
                                    Manage Modules
                                </Link>
                            </div>
                        </div>

                        {/* Modules Section */}
                        <div className="mt-2">
                            <h6>Modules:</h6>
                            <ul className="list-group">
                                {modules[course._id]?.map((mod) => (
                                    <li key={mod._id} className="list-group-item d-flex justify-content-between">
                                        {mod.name}
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteModule(course._id, mod._id)}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Add Module Section */}
                            <div className="mt-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="New Module Name"
                                    value={newModule[course._id] || ""}
                                    onChange={(e) => setNewModule({ ...newModule, [course._id]: e.target.value })}
                                />
                                <button className="btn btn-primary mt-2" onClick={() => handleAddModule(course._id)}>
                                    Add Module
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPage;
