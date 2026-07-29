import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProjects } from "../../services/projectService";

function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getMyProjects();

                setProjects(data.projects ?? data);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load projects"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="p-8">
                <p>Loading projects...</p>
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

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Projects
                    </h1>

                    <p className="mt-1 text-gray-500">
                        View and manage your projects
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                >
                    Create Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="rounded-xl bg-white p-8 text-center shadow">
                    <p className="text-gray-500">
                        You do not have any projects yet.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {project.name}
                                </h2>

                                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                    {project.status}
                                </span>
                            </div>

                            <p className="mb-5 line-clamp-3 text-sm text-gray-500">
                                {project.description ||
                                    "No description provided"}
                            </p>

                            <div className="text-sm text-gray-500">
                                <p>
                                    Deadline:{" "}
                                    {project.deadline
                                        ? new Date(
                                              project.deadline
                                          ).toLocaleDateString()
                                        : "No deadline"}
                                </p>

                                {project.role && (
                                    <p className="mt-2">
                                        Your role: {project.role}
                                    </p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Projects;