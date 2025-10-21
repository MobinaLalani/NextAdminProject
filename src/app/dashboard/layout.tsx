// src/app/dashboard/layout.tsx
import Navbar from "@/components/layout/baseLayout/navbar/navbar";
import Sidebar from "@/components/layout/baseLayout/sidebar/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
