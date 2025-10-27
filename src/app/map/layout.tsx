// src/app/dashboard/layout.tsx
import Navbar from "@/components/layout/mapLayout/navbar/navbar";
import Sidebar from "@/components/layout/mapLayout/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9F2F2]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
