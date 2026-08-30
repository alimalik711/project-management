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
    searchTasks,
    filterTasks,
    sortTasks,
} from "../../services/taskService";

import CreateTaskForm from "../../components/task/CreateTaskForm";

function Tasks() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [tasks, setTasks] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState("");

    // Search, Filter & Sort States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("DESC");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);
                setError("");

                const data = await getMyProjects();

                if (!Array.isArray(data.projects)) {
                    throw new Error("Projects response is not an array");
                }

                setProjects(data.projects);

                if (data.projects.length > 0) {
                    setSelectedProjectId(String(data.projects[0].id));
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
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

            let data;

            // Use search endpoint if search query present
            if (searchQuery.trim()) {
                data = await searchTasks(selectedProjectId, searchQuery.trim());
            } 
            // Use filter endpoint if filters present
            else if (statusFilter || priorityFilter) {
                const filters = {};
                if (statusFilter) filters.status = statusFilter;
                if (priorityFilter) filters.priority = priorityFilter;
                data = await filterTasks(selectedProjectId, filters);
            }
            // Use sort endpoint if sort altered
            else if (sortBy !== "created_at" || sortOrder !== "DESC") {
                data = await sortTasks(selectedProjectId, sortBy, sortOrder);
            }
            // Default project tasks list
            else {
                data = await getProjectTasks(selectedProjectId);
            }

            const taskList = Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : [];
            setTasks(taskList);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to load tasks"
            );
        } finally {
            setLoadingTasks(false);
        }
    }, [selectedProjectId, searchQuery, statusFilter, priorityFilter, sortBy, sortOrder]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("");
        setPriorityFilter("");
        setSortBy("created_at");
        setSortOrder("DESC");
    };

    if (loadingProjects) {
        return (
            <div className="p-8">
                <p className="text-gray-500">Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
                <p className="mt-1 text-gray-500">
                    View, search, filter, and manage project tasks
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
                    {/* Project Selector & Search/Filter Bar */}
                    <div className="mb-6 rounded-xl bg-white p-5 shadow space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <label
                                    htmlFor="project"
                                    className="mb-1 block text-sm font-medium text-gray-700"
                                >
                                    Select Project
                                </label>
                                <select
                                    id="project"
                                    value={selectedProjectId}
                                    onChange={(event) => {
                                        setSelectedProjectId(event.target.value);
                                        handleClearFilters();
                                    }}
                                    className="w-full rounded-lg border px-3 py-2 md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {projects.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowCreateForm(true)}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 font-medium"
                            >
                                + Create Task
                            </button>
                        </div>

                        {/* Search, Filters, and Sort Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 border-t pt-4">
                            {/* Search input */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Search Tasks
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by title or description..."
                                    className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Status filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Filter by Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="TODO">TODO</option>
                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                    <option value="COMPLETED">COMPLETED</option>
                                </select>
                            </div>

                            {/* Priority filter */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">
                                    Filter by Priority
                                </label>
                                <select
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Priorities</option>
                                    <option value="LOW">LOW</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HIGH">HIGH</option>
                                </select>
                            </div>

                            {/* Sort control */}
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="created_at">Date Created</option>
                                        <option value="title">Title</option>
                                        <option value="status">Status</option>
                                        <option value="priority">Priority</option>
                                        <option value="due_date">Due Date</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                        Order
                                    </label>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="rounded-lg border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="DESC">DESC</option>
                                        <option value="ASC">ASC</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {(searchQuery || statusFilter || priorityFilter || sortBy !== "created_at" || sortOrder !== "DESC") && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Clear filters & search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Task List */}
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                Project Tasks ({tasks.length})
                            </h2>
                        </div>

                        {loadingTasks ? (
                            <p className="text-gray-500">Loading tasks...</p>
                        ) : tasks.length === 0 ? (
                            <p className="text-gray-500">
                                No tasks found matching your criteria.
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
                                                    {task.description || "No description"}
                                                </p>
                                            </div>

                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                                {task.status}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
                                            <p>
                                                Priority: {task.priority}
                                            </p>

                                            <p>
                                                Due:{" "}
                                                {task.due_date
                                                    ? new Date(task.due_date).toLocaleDateString()
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
                            projectId={selectedProjectId}
                            onTaskCreated={fetchTasks}
                            onClose={() => setShowCreateForm(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
}

export default Tasks;