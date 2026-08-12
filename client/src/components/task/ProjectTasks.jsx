
import { useEffect, useState } from "react";
import {
    getProjectTasks,
} from "../../services/taskService";

function ProjectTasks({ projectId }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getProjectTasks(
                        projectId
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
                setLoading(false);
            }
        };

        fetchTasks();
    }, [projectId]);

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                    Tasks
                </h2>

                <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    Create Task
                </button>
            </div>

            {error && (
                <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {loading ? (
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
                        <div
                            key={task.id}
                            className="rounded-lg border p-4"
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

                            <div className="mt-4 flex gap-6 text-sm text-gray-500">
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectTasks;