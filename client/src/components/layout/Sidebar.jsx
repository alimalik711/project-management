import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Sidebar() {
    const { user } = useAuth();

    const getLinkClass = ({ isActive }) => {
        return `
            px-4 py-2 rounded-lg
            ${isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-200"
            }
        `;
    };

    return (
        <aside className="w-64 min-h-screen border-r bg-white p-4">

            <nav className="flex flex-col gap-3">

                <NavLink
                    to="/dashboard"
                    className={getLinkClass}
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/projects"
                    className={getLinkClass}
                >
                    Projects
                </NavLink>

                <NavLink
                    to="/tasks"
                    className={getLinkClass}
                >
                    Tasks
                </NavLink>

                <NavLink
                    to="/notifications"
                    className={getLinkClass}
                >
                    Notifications
                </NavLink>

                <NavLink
                    to="/profile"
                    className={getLinkClass}
                >
                    Profile
                </NavLink>

                {user?.role === "ADMIN" && (
                    <NavLink
                        to="/admin"
                        className={getLinkClass}
                    >
                        Admin Panel
                    </NavLink>
                )}

            </nav>

        </aside>
    );
}

export default Sidebar;