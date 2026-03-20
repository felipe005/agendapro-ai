import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export const AppLayout = () => {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 xl:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[280px_1fr]">
        <Sidebar />
        <main className="space-y-6">
          <Topbar />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
