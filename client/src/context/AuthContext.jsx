import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    login,
    logout,
    getProfile
} from "../services/authService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const checkAuth = async () => {

            try {
                const data = await getProfile();
                setUser(data.user ?? data);

            } catch {
                setUser(null);

            } finally {
                setLoading(false);
            }
        };

        checkAuth();

    }, []);

    const loginUser = async (formData) => {

        await login(formData);

        const data = await getProfile();

        setUser(data.user ?? data);
    };

    const logoutUser = async () => {

        await logout();

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginUser,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}