import {
    useCallback,
    useEffect,
    useState,
} from "react";

import { Link } from "react-router-dom";

import {
    getMyProjects,
} from "../../services/projectService";

import {
    getProjectTasks,
} from "../../services/taskService";

import CreateTaskForm from "../../components/task/CreateTaskForm";

function Tasks() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] =
        useState("");

    const [tasks, setTasks] = useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [loadingTasks, setLoadingTasks] =
        useState(false);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);
                setError("");

                const data = await getMyProjects();

                if (!Array.isArray(data.projects)) {
                    throw new Error(
                        "Projects response is not an array"
                    );
                }

                setProjects(data.projects);

                if (data.projects.length > 0) {
                    setSelectedProjectId(
                        String(data.projects[0].id)
                    );
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        error.message ||
                        "Failed to load projects"
                );
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchProjects();
    }, []);

    const fetchTasks = useCallback(async () => {
        if (!selectedProjectId) {
            setTasks([]);
            return;
        }

        try {
            setLoadingTasks(true);
            setError("");

            const data =
                await getProjectTasks(
                    selectedProjectId
                );

            if (!Array.isArray(data.tasks)) {
                throw new Error(
                    "Tasks response is not an array"
                );
            }

            setTasks(data.tasks);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load tasks"
            );
        } finally {
            setLoadingTasks(false);
        }
    }, [selectedProjectId]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (loadingProjects) {
        return (
            <div className="p-8">
                <p className="text-gray-500">
                    Loading projects...
                </p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Tasks
                </h1>

                <p className="mt-1 text-gray-500">
                    View and manage project tasks
                </p>
            </div>

            {error && (
                <p className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {projects.length === 0 ? (
                <div className="rounded-xl bg-white p-8 shadow">
                    <p className="text-gray-500">
                        You are not part of any projects.
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-6 rounded-xl bg-white p-5 shadow">
                        <label
                            htmlFor="project"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Select Project
                        </label>

                        <select
                            id="project"
                            value={selectedProjectId}
                            onChange={(event) =>
                                setSelectedProjectId(
                                    event.target.value
                                )
                            }
                            className="w-full rounded-lg border px-3 py-2 md:w-80"
                        >
                            {projects.map((project) => (
                                <option
                                    key={project.id}
                                    value={project.id}
                                >
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                Project Tasks
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCreateForm(true)
                                }
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                            >
                                Create Task
                            </button>
                        </div>

                        {loadingTasks ? (
                            <p className="text-gray-500">
                                Loading tasks...
                            </p>
                        ) : tasks.length === 0 ? (
                            <p className="text-gray-500">
                                No tasks found for this project.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <Link
                                        key={task.id}
                                        to={`/tasks/${task.id}`}
                                        className="block rounded-lg border p-5 transition hover:bg-gray-50"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-gray-800">
                                                    {task.title}
                                                </h3>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {task.description ||
                                                        "No description"}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {task.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                                            <p>
                                                Priority:{" "}
                                                {task.priority}
                                            </p>

                                            <p>
                                                Due:{" "}
                                                {task.due_date
                                                    ? new Date(
                                                          task.due_date
                                                      ).toLocaleDateString()
                                                    : "No due date"}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {showCreateForm && (
                        <CreateTaskForm
                            projectId={
                                selectedProjectId
                            }
                            onTaskCreated={
                                fetchTasks
                            }
                            onClose={() =>
                                setShowCreateForm(
                                    false
                                )
                            }
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Tasks;