import { useEffect, useState } from "react";
import {
    updateProject,
} from "../../services/projectService";

function EditProjectForm({
    project,
    onClose,
    onProjectUpdated,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        deadline: "",
    });

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        setFormData({
            name: project?.name ?? "",
            description:
                project?.description ?? "",

            deadline: project?.deadline
                ? project.deadline.split("T")[0]
                : "",
        });
    }, [project]);

    const handleChange = (event) => {
        const { name, value } =
            event.target;

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

            const data =
                await updateProject(
                    project.id,
                    {
                        name: formData.name,
                        description:
                            formData.description,
                        deadline:
                            formData.deadline ||
                            null,
                    }
                );

            onProjectUpdated(
                data.project ?? {
                    ...project,
                    ...formData,
                    deadline:
                        formData.deadline ||
                        null,
                }
            );

            onClose();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to update project"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Project
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="text-2xl text-gray-500 hover:text-gray-800"
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-5">
                        <label
                            htmlFor="edit-name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Project name
                        </label>

                        <input
                            id="edit-name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="edit-description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="edit-description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            rows="4"
                            className="w-full resize-none rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="edit-deadline"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Deadline
                        </label>

                        <input
                            id="edit-deadline"
                            type="date"
                            name="deadline"
                            value={
                                formData.deadline
                            }
                            onChange={handleChange}
                            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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

export default EditProjectForm;