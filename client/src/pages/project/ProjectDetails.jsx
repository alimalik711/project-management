import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
    archiveProject,
    getProjectById,
} from "../../services/projectService";

import ProjectMembers from "../../components/project/ProjectMembers";
import ProjectActivity from "../../components/project/ProjectActivity";
import EditProjectForm from "../../components/project/EditProjectForm";

function ProjectDetails() {
    /*
        Your React route is:

        /projects/:id

        For the URL /projects/7:

        useParams() returns:
        {
            id: "7"
        }
    */
    const { id } = useParams();
    const projectId = id;

    const [project, setProject] = useState(null);

    const [loading, setLoading] = useState(true);
    const [archiving, setArchiving] = useState(false);
    const [showEditForm, setShowEditForm] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");
                setSuccess("");

                const data =
                    await getProjectById(projectId);

                if (!data.project) {
                    throw new Error(
                        "Project data was not returned"
                    );
                }

                setProject(data.project);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        error.message ||
                        "Failed to load project"
                );
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleArchiveProject = async () => {
        try {
            setArchiving(true);
            setError("");
            setSuccess("");

            const data =
                await archiveProject(projectId);

            /*
                Keep existing frontend properties such
                as project.role even if the archive
                endpoint does not return them.
            */
            setProject((previousProject) => ({
                ...previousProject,
                ...(data.project ?? {}),
                status:
                    data.project?.status ??
                    "ARCHIVED",
            }));

            setSuccess(
                "Project archived successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to archive project"
            );
        } finally {
            setArchiving(false);
        }
    };

    const handleProjectUpdated = (
        updatedProject
    ) => {
        /*
            Merge the updated fields into the old
            project instead of replacing everything.

            This preserves properties such as role
            if the update endpoint does not return them.
        */
        setProject((previousProject) => ({
            ...previousProject,
            ...updatedProject,
        }));

        setError("");
        setSuccess(
            "Project updated successfully"
        );
    };

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-500">
                    Loading project...
                </p>
            </div>
        );
    }

    /*
        This handles an error that happened before
        any project was successfully loaded.
    */
    if (error && !project) {
        return (
            <div className="p-8">
                <div className="rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </div>

                <Link
                    to="/projects"
                    className="mt-5 inline-block text-blue-600 hover:underline"
                >
                    ← Back to projects
                </Link>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="p-8">
                <p className="text-gray-500">
                    Project not found.
                </p>

                <Link
                    to="/projects"
                    className="mt-5 inline-block text-blue-600 hover:underline"
                >
                    ← Back to projects
                </Link>
            </div>
        );
    }

    const isOwner =
        project.role === "OWNER";

    const isArchived =
        project.status === "ARCHIVED";

    return (
        <div className="p-8">
            <Link
                to="/projects"
                className="mb-6 inline-block text-blue-600 hover:underline"
            >
                ← Back to projects
            </Link>

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

            <div className="rounded-xl bg-white p-8 shadow">
                <div className="mb-6 flex items-start justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {project.name}
                        </h1>

                        <p className="mt-2 text-gray-500">
                            {project.description ||
                                "No description provided"}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                            {project.status}
                        </span>

                        {isOwner && !isArchived && (
                            <button
                                type="button"
                                onClick={() => {
                                    setError("");
                                    setSuccess("");
                                    setShowEditForm(
                                        true
                                    );
                                }}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                                Edit Project
                            </button>
                        )}

                        {isOwner && !isArchived && (
                            <button
                                type="button"
                                onClick={
                                    handleArchiveProject
                                }
                                disabled={archiving}
                                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {archiving
                                    ? "Archiving..."
                                    : "Archive Project"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid gap-5 border-t pt-6 md:grid-cols-3">
                    <div>
                        <p className="text-sm text-gray-500">
                            Deadline
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {project.deadline
                                ? new Date(
                                      project.deadline
                                  ).toLocaleDateString()
                                : "No deadline"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Your role
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {project.role ||
                                "MEMBER"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Created
                        </p>

                        <p className="mt-1 font-medium text-gray-800">
                            {project.created_at
                                ? new Date(
                                      project.created_at
                                  ).toLocaleDateString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <ProjectMembers
                    projectId={projectId}
                    currentUserRole={project.role}
                />
            </div>

            <div className="mt-8">
                <ProjectActivity
                    projectId={projectId}
                />
            </div>

            {showEditForm && (
                <EditProjectForm
                    project={project}
                    onProjectUpdated={
                        handleProjectUpdated
                    }
                    onClose={() =>
                        setShowEditForm(false)
                    }
                />
            )}
        </div>
    );
}

export default ProjectDetails;