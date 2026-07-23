import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboardService";
import StatsCard from "../../components/common/StatsCard";

function Dashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboard(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    const stats = [
        {
            title: "Projects",
            value: dashboard.total_projects,
        },
        {
            title: "Tasks",
            value: dashboard.assigned_tasks,
        },
        {
            title: "Completed",
            value: dashboard.completed_tasks,
        },
        {
            title: "Pending",
            value: dashboard.pending_tasks,
        },
        {
            title: "Overdue",
            value: dashboard.overdue_tasks,
        },
        {
            title: "Notifications",
            value: dashboard.unread_notifications,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="text-gray-500 mt-2">
                    Welcome back! Here's an overview of your workspace.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {stats.map((stat) => (
                    <StatsCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                    />
                ))}

            </div>

        </div>
    );
}

export default Dashboard;