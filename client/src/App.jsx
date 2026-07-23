import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/project/Projects";
// import ProjectDetails from "./pages/project/ProjectDetails";
// import Tasks from "./pages/task/Tasks";
// import Profile from "./pages/profile/Profile";
// import Notifications from "./pages/notification/Notifications";
// import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardLayout from "./layouts/DashboardLayout";

function App() {

    return (

        <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/" element={<DashboardLayout />}>

            <Route path="dashboard" element={<Dashboard />} />

                 <Route path="/projects" element={<Projects />} />

                {/* <Route path="/projects/:id" element={<ProjectDetails />} />

                <Route path="/tasks" element={<Tasks />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/notifications" element={<Notifications />} />

                <Route path="/admin" element={<AdminDashboard/>} />  */}

            </Route>

        </Routes>

    );

}

export default App;