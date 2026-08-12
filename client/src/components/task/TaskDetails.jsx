import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTaskById } from "../../services/taskService";

function TaskDetails() {
    const { taskId } = useParams();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTask = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getTaskById(taskId);

                if (!data.task) {
                    throw new Error("Task data was not returned");
                }

                setTask(data.task);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load task"
                );
            } finally {
                setLoading(false);
            }
        };

        if (taskId) {
            fetchTask();
        }
    }, [taskId]);

    if (loading) {
        return (
            <div className="p-8">
                <p>Loading task...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <p className="text-red-600">
                    {error}
                </p>
            </div>
        );
    }

    if (!task) {
        return null;
    }

    return (
        <div className="p-8">
            <Link
                to="/tasks"
                className="mb-6 inline-block text-blue-600"
            >
                ← Back to Tasks
            </Link>

            <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            {task.title}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {task.description ||
                                "No description"}
                        </p>
                    </div>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                        {task.status}
                    </span>
                </div>

                <div className="mt-8 space-y-3">
                    <p>
                        <strong>Priority:</strong>{" "}
                        {task.priority}
                    </p>

                    <p>
                        <strong>Due date:</strong>{" "}
                        {task.due_date
                            ? new Date(
                                  task.due_date
                              ).toLocaleDateString()
                            : "No due date"}
                    </p>

                    <p>
                        <strong>Created:</strong>{" "}
                        {new Date(
                            task.created_at
                        ).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;