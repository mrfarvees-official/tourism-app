import AdminGuard from "@/src/app/AdminGuard";
import type { ReactNode } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <AdminGuard>{children}</AdminGuard>;
}
