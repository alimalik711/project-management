import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    login,
    logout,
    getProfile,
    updateProfile,
    uploadAvatar
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

    const updateUserProfile = async (formData) => {
    await updateProfile(formData);

    const data = await getProfile();

    setUser(data.user ?? data);
};


    const updateUserAvatar = async (file) => {
    const formData = new FormData();

    formData.append("avatar", file);

    await uploadAvatar(formData);

    const data = await getProfile();

    setUser(data.user ?? data);
};

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                loginUser,
                logoutUser,
                updateUserProfile,
                updateUserAvatar
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}