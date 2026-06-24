import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Server Component — reads session and redirects to role-specific dashboard
export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  const role = session.user?.role;

  if (role === "admin") {
    redirect("/dashboard/admin");
  } else if (role === "lawyer") {
    redirect("/dashboard/lawyer");
  } else {
    redirect("/dashboard/user");
  }
}
