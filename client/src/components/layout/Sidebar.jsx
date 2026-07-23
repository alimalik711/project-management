import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className=" w-64 border-r min-h-screen p-4 flex flex-col gap-3">

            <NavLink to="/dashboard">
                Dashboard
            </NavLink>

            <NavLink to="/projects">
                Projects
            </NavLink>

            <NavLink to="/tasks">
                Tasks
            </NavLink>

            <NavLink to="/notifications">
                Notifications
            </NavLink>

            <NavLink to="/profile">
                Profile
            </NavLink>

        </aside>
    );
}

export default Sidebar;