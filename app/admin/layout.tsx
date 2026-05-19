import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Sri Murugan Coconut Wholesale"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
