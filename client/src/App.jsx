import { Routes, Route } from "react-router-dom";


import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/project/Projects";
// import ProjectDetails from "./pages/project/ProjectDetails";
// import Tasks from "./pages/task/Tasks";
import Profile from "./pages/profile/Profile";
// import Notifications from "./pages/notification/Notifications";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminRoute from "./components/common/AdminRoute";

function App() {
    return (
        <Routes>

            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected */}
            <Route path="/"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                {/* <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/tasks" element={<Tasks />} /> */}
                <Route path="/profile" element={<Profile />} /> */
                {/* <Route path="/notifications" element={<Notifications />} /> */}
                {/* <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
               /> */}
            </Route>

        </Routes>
    );
}

export default App;