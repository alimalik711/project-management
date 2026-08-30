import api from "./api";

export const getTaskFiles = async (taskId) => {
    const response = await api.get(`/files/task/${taskId}`);
    return response.data;
};

export const uploadFile = async (taskId, formData) => {
    const response = await api.post(`/files/task/${taskId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteFile = async (fileId) => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
};
