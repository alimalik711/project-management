import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout() {
    return (
        <>
            <Navbar />

            <div className="flex">
                <Sidebar />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </>
    );
}

export default DashboardLayout;