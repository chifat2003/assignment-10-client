import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "./components/Sidebar";

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const userRole = session.user?.role || "user";

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar userRole={userRole} />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
