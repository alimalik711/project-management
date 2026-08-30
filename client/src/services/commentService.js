import api from "./api";

export const getTaskComments = async (taskId) => {
    const response = await api.get(`/comments/task/${taskId}`);
    return response.data;
};

export const createComment = async (taskId, contentData) => {
    const response = await api.post(`/comments/task/${taskId}`, contentData);
    return response.data;
};

export const updateComment = async (commentId, contentData) => {
    const response = await api.patch(`/comments/${commentId}`, contentData);
    return response.data;
};

export const deleteComment = async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
};
