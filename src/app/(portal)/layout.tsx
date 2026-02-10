import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import PortalNav from "@/components/portal/PortalNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getProfile();
  if (!data) redirect("/login");
  if (data.role !== "client") redirect("/dashboard");

  return (
    <>
      <PortalNav />
      <main style={{ padding: 24, minHeight: "100vh" }}>{children}</main>
    </>
  );
}
