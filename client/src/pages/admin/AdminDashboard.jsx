import { useEffect, useState, useCallback } from "react";
import {
    getAllUsers,
    blockUser,
    unblockUser,
    deleteUser,
    getAllProjects,
    getAllTasks,
    getAdminStats,
} from "../../services/adminService";
import StatsCard from "../../components/common/StatsCard";

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("users"); // "users" | "projects" | "tasks"

    // Stats state
    const [stats, setStats] = useState(null);

    // Data lists
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);

    // Search and loading states
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (err) {
            console.error("Failed to load admin stats:", err);
        }
    };

    const fetchActiveTabData = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (activeTab === "users") {
                const data = await getAllUsers({ search });
                setUsers(Array.isArray(data.users) ? data.users : Array.isArray(data) ? data : []);
            } else if (activeTab === "projects") {
                const data = await getAllProjects({ search });
                setProjects(Array.isArray(data.projects) ? data.projects : Array.isArray(data) ? data : []);
            } else if (activeTab === "tasks") {
                const data = await getAllTasks({ search });
                setTasks(Array.isArray(data.tasks) ? data.tasks : Array.isArray(data) ? data : []);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [activeTab, search]);

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        fetchActiveTabData();
    }, [fetchActiveTabData]);

    const handleBlockUser = async (userId) => {
        try {
            setError("");
            setSuccess("");
            await blockUser(userId);
            setSuccess("User blocked successfully");
            fetchActiveTabData();
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to block user");
        }
    };

    const handleUnblockUser = async (userId) => {
        try {
            setError("");
            setSuccess("");
            await unblockUser(userId);
            setSuccess("User unblocked successfully");
            fetchActiveTabData();
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to unblock user");
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            setError("");
            setSuccess("");
            await deleteUser(userId);
            setSuccess("User deleted successfully");
            fetchActiveTabData();
            fetchStats();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Control Panel</h1>
                <p className="mt-1 text-gray-500">
                    System management, user permissions, projects and tasks auditing.
                </p>
            </div>

            {/* Admin Stats Grid */}
            {stats && (
                <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard title="Total Users" value={stats.total_users ?? 0} />
                    <StatsCard title="Total Projects" value={stats.total_projects ?? 0} />
                    <StatsCard title="Total Tasks" value={stats.total_tasks ?? 0} />
                    <StatsCard title="Blocked Users" value={stats.blocked_users ?? 0} />
                </div>
            )}

            {error && (
                <p className="mb-6 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {success && (
                <p className="mb-6 rounded-lg bg-green-100 px-4 py-3 text-green-700">
                    {success}
                </p>
            )}

            {/* Tab Header & Search */}
            <div className="mb-6 rounded-xl bg-white p-5 shadow space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex border-b border-gray-200 gap-4">
                        <button
                            type="button"
                            onClick={() => { setActiveTab("users"); setSearch(""); }}
                            className={`pb-3 font-semibold text-sm transition border-b-2 ${
                                activeTab === "users"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab("projects"); setSearch(""); }}
                            className={`pb-3 font-semibold text-sm transition border-b-2 ${
                                activeTab === "projects"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            All Projects
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab("tasks"); setSearch(""); }}
                            className={`pb-3 font-semibold text-sm transition border-b-2 ${
                                activeTab === "tasks"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            All Tasks
                        </button>
                    </div>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${activeTab}...`}
                        className="rounded-lg border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                    />
                </div>
            </div>

            {/* Tab Contents */}
            <div className="rounded-xl bg-white p-6 shadow">
                {loading ? (
                    <p className="text-gray-500">Loading {activeTab}...</p>
                ) : activeTab === "users" ? (
                    users.length === 0 ? (
                        <p className="text-gray-500">No users found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Email</th>
                                        <th className="p-3">Role</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-800">{user.name}</td>
                                            <td className="p-3">{user.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    user.is_blocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                                                }`}>
                                                    {user.is_blocked ? "BLOCKED" : "ACTIVE"}
                                                </span>
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                {user.is_blocked ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUnblockUser(user.id)}
                                                        className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                                                    >
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleBlockUser(user.id)}
                                                        className="rounded bg-yellow-500 px-3 py-1 text-xs text-white hover:bg-yellow-600"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : activeTab === "projects" ? (
                    projects.length === 0 ? (
                        <p className="text-gray-500">No projects found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="p-3">Project Name</th>
                                        <th className="p-3">Owner</th>
                                        <th className="p-3">Owner Email</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Created</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-800">{project.name || project.title}</td>
                                            <td className="p-3">{project.owner_name}</td>
                                            <td className="p-3">{project.owner_email}</td>
                                            <td className="p-3">
                                                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                {project.created_at ? new Date(project.created_at).toLocaleDateString() : ""}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    tasks.length === 0 ? (
                        <p className="text-gray-500">No tasks found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="p-3">Task Title</th>
                                        <th className="p-3">Project</th>
                                        <th className="p-3">Creator</th>
                                        <th className="p-3">Status</th>
                                        <th className="p-3">Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium text-gray-800">{task.title}</td>
                                            <td className="p-3">{task.project_name}</td>
                                            <td className="p-3">{task.creator_name}</td>
                                            <td className="p-3">
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                                                    {task.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                                                    {task.priority}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
