import { Sidebar } from "@/components/admin/sidebar";
import { Navbar } from "@/components/admin/navbar";

export const metadata = {
  title: "Admin Dashboard - BuildSight",
  description: "BuildSight Admin Dashboard",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <Navbar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
