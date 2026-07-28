import api from "./api";

export const login = async (formData) => {
    const response = await api.post("/auth/login", formData);
    return response.data;
};

export const signup = async (formData) => {
    const response = await api.post("/auth/signup", formData);
    return response.data;
};

export const logout = async () => {
    const response = await api.post("/auth/logout");
    return response.data; 
};

export const getProfile = async () => {
    const response = await api.get("/users/profile");
    return response.data;
};

export const updateProfile = async (formData) => {
    const response = await api.put("/users/profile", formData);
    return response.data;
};

export const changePassword = async (formData) => {
    const response = await api.put("/users/change-password", formData);
    return response.data;
};