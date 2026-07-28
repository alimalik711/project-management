import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
    const navigate = useNavigate();

    const { user, logoutUser } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutUser();

            navigate("/login");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 border-b">

            <h1 className="font-bold text-xl">
                Project Manager
            </h1>

            <div className="flex items-center gap-4">

                <span>
                    {user?.name}
                </span>

                <button
                    onClick={handleLogout}
                    className="border px-4 py-2 rounded"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;