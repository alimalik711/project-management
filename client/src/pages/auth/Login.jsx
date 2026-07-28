import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Login() {
    const navigate = useNavigate();

    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await loginUser(formData);

            navigate("/dashboard");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-8 rounded-xl shadow-md"
            >

                <h1 className="text-3xl font-bold text-center mb-6">
                    Login
                </h1>

                {error && (
                    <p className="mb-4 text-red-500 text-sm text-center">
                        {error}
                    </p>
                )}

                <div className="mb-4">

                    <label
                        htmlFor="email"
                        className="block mb-2 font-medium"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <div className="mb-6">

                    <label
                        htmlFor="password"
                        className="block mb-2 font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="text-center mt-5 text-sm">
                    Don't have an account?{" "}

                    <Link
                        to="/signup"
                        className="text-blue-600 hover:underline"
                    >
                        Create account
                    </Link>
                </p>

            </form>

        </div>
    );
}

export default Login;