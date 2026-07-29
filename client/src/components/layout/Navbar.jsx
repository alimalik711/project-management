import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import UserAvatar from "../common/UserAvatar";

function Navbar() {
    const navigate = useNavigate();

    const {
        user,
        logoutUser
    } = useAuth();


    const handleLogout = async () => {
        await logoutUser();
        navigate("/login");
    };

    return (
        <nav className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
            <h1 className="text-xl font-bold text-gray-800">
                Project Management
            </h1>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3"
                >
                    <UserAvatar
    user={user}
    size="md"
/>

                    <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">
                            {user?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                            {user?.role}
                        </p>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;