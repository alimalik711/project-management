import { useEffect, useState } from "react";
import {
    getProjectActivity,
} from "../../services/projectService";

function ProjectActivity({ projectId }) {
    const [activities, setActivities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                setLoading(true);
                setError("");

                const data =
                    await getProjectActivity(
                        projectId
                    );

                if (!Array.isArray(data.activities)) {
                    throw new Error(
                        "Activity response is not an array"
                    );
                }

                setActivities(data.activities);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to load project activity"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [projectId]);

    return (
        <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
                Project Activity
            </h2>

            {error && (
                <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="text-gray-500">
                    Loading activity...
                </p>
            ) : activities.length === 0 ? (
                <p className="text-gray-500">
                    No project activity found.
                </p>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="border-b pb-4 last:border-b-0"
                        >
                            <p className="text-gray-800">
                                {activity.message}
                            </p>

                            {activity.user_name && (
                                <p className="mt-1 text-sm text-gray-500">
                                    By {activity.user_name}
                                </p>
                            )}

                            <p className="mt-1 text-xs text-gray-400">
                                {activity.created_at
                                    ? new Date(
                                          activity.created_at
                                      ).toLocaleString()
                                    : "Unknown time"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProjectActivity;