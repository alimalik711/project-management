import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

    return (
        <>
            <h1>Login</h1>

            <button onClick={() => navigate("/dashboard")}>
                Fake Login
            </button>
        </>
    );
}

export default Login;