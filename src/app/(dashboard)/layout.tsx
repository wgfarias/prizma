import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getProfile();
  if (!data) redirect("/login");
  if (data.role === "client") redirect("/portal/portal");

  return (
    <>
      <DashboardNav />
      <main style={{ padding: 24 }}>{children}</main>
    </>
  );
}
