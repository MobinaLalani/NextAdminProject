import { Home, Package, Users, Settings } from "lucide-react";

export type Role = "admin" | "manager" | "user";

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[]; // نقش‌هایی که می‌تونن ببینن
}

export const menuItems: MenuItem[] = [
  {
    title: "داشبورد",
    path: "/dashboard",
    icon: <Home size={18} />,
    roles: ["admin", "manager", "user"],
  },
  {
    title: "اطلاعات کاربر",
    path: "/orders",
    icon: <Package size={18} />,
    roles: ["admin", "manager"],
  },
  {
    title: "مشتریان",
    path: "/users",
    icon: <Users size={18} />,
    roles: ["admin"],
  },
  {
    title: "تنظیمات",
    path: "/settings",
    icon: <Settings size={18} />,
    roles: ["admin"],
  },
];
