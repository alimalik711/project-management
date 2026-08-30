import api from "./api";

export const getAllUsers = async (params) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
};

export const blockUser = async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/block`);
    return response.data;
};

export const unblockUser = async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/unblock`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
};

export const getAllProjects = async (params) => {
    const response = await api.get("/admin/projects", { params });
    return response.data;
};

export const getAllTasks = async (params) => {
    const response = await api.get("/admin/tasks", { params });
    return response.data;
};

export const getAdminStats = async () => {
    const response = await api.get("/admin/stats");
    return response.data;
};
