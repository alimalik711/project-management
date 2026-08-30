import { useEffect, useState } from "react";
import { updateTask } from "../../services/taskService";

function EditTaskForm({
    task,
    onTaskUpdated,
    onClose,
}) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        due_date: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setFormData({
            title: task?.title ?? "",
            description: task?.description ?? "",
            priority: task?.priority ?? "MEDIUM",
            due_date: task?.due_date
                ? task.due_date.split("T")[0]
                : "",
        });
    }, [task]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            const data = await updateTask(
                task.id,
                {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    due_date: formData.due_date || null,
                }
            );

            onTaskUpdated(
                data.task ?? {
                    ...task,
                    ...formData,
                    due_date:
                        formData.due_date || null,
                }
            );

            onClose();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to update task"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-5 text-xl font-bold">
                    Edit Task
                </h2>

                {error && (
                    <p className="mb-4 text-red-600">
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">
                            Medium
                        </option>
                        <option value="HIGH">
                            High
                        </option>
                    </select>

                    <input
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-3 py-2"
                    />

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-4 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTaskForm;