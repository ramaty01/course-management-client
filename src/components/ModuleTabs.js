import React from "react";

const ModuleTabs = ({ modules, activeModule, setActiveModule }) => {
    return (
        <div className="nav flex-column nav-pills">
            {modules.map((module) => (
                <button
                    key={module._id}
                    className={`nav-link ${activeModule === module._id ? "active" : ""}`}
                    onClick={() => setActiveModule(module._id)}
                >
                    {module.name}
                </button>
            ))}
        </div>
    );
};

export default ModuleTabs;
