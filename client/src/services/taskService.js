import api from "./api";

export const createTask = async (
    projectId,
    taskData
) => {
    const response = await api.post(
        `/tasks/project/${projectId}`,
        taskData
    );

    return response.data;
};

export const getProjectTasks = async (
    projectId
) => {
    const response = await api.get(
        `/tasks/project/${projectId}`
    );

    return response.data;
};

export const getTaskById = async (taskId) => {
    const response = await api.get(
        `/tasks/${taskId}`
    );

    return response.data;
};

export const updateTask = async (
    taskId,
    taskData
) => {
    const response = await api.patch(
        `/tasks/${taskId}`,
        taskData
    );

    return response.data;
};

export const deleteTask = async (taskId) => {
    const response = await api.delete(
        `/tasks/${taskId}`
    );

    return response.data;
};

export const assignTask = async (
    taskId,
    assignmentData
) => {
    const response = await api.post(
        `/tasks/${taskId}/assign`,
        assignmentData
    );

    return response.data;
};

export const changeTaskStatus = async (
    taskId,
    statusData
) => {
    const response = await api.patch(
        `/tasks/${taskId}/status`,
        statusData
    );

    return response.data;
};

export const searchTasks = async (
    projectId,
    search
) => {
    const response = await api.get(
        `/tasks/project/${projectId}/search`,
        {
            params: {
                search,
            },
        }
    );

    return response.data;
};

export const filterTasks = async (
    projectId,
    filters
) => {
    const response = await api.get(
        `/tasks/project/${projectId}/filter`,
        {
            params: filters,
        }
    );

    return response.data;
};

export const sortTasks = async (
    projectId,
    sortBy,
    order
) => {
    const response = await api.get(
        `/tasks/project/${projectId}/sort`,
        {
            params: {
                sortBy,
                order,
            },
        }
    );

    return response.data;
};