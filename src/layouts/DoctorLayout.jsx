import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DoctorLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--body)]">
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={closeSidebar}
        />

        {/* Main dashboard area */}
        <div className="min-w-0 flex-1">
          <Navbar onMenuClick={openSidebar} />

          <main className="min-h-[calc(100vh-73px)] overflow-x-hidden bg-[var(--background)] p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-[var(--container)]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}