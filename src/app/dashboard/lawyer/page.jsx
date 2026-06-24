"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardContent from "@/app/dashboard/components/DashboardContent";
import { useSession } from '@/lib/auth-client';
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

const stats = [
  { label: "Active Cases", value: 6 },
  { label: "Total Clients", value: 24 },
  { label: "Upcoming Appointments", value: 4 },
  { label: "Reviews", value: 18 },
];

const history = [
  {
    title: "Case closed — Rivera vs. State",
    description: "Successfully defended in criminal trial. Verdict: Not Guilty",
    date: "Jun 21",
  },
  {
    title: "New client acquired",
    description: "Engaged by TechCorp Inc. for intellectual property litigation",
    date: "Jun 19",
  },
  {
    title: "Consultation with Sarah Kim",
    description: "Family law intake completed. Retainer signed.",
    date: "Jun 17",
  },
];

export default function LawyerDashboard() {
    const { data: session, isPending } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!isPending) {
        if (!session) {
          router.replace("/signin");
          return;
        }
        if (session.user?.role === "user") {
          router.replace("/dashboard/user");
          return;
        }
        if (session.user?.role === "admin") {
          router.replace("/dashboard/admin");
          return;
        }
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
      }
    }, [isPending, session, router]);

    if (isPending || isLoading) {
        return <LoadingSpinner size="lg" />;
    }

    return (
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', padding: '16px 16px 0' }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>
            Welcome, {session?.user?.name}
          </h1>
          <Link
            href="/dashboard/lawyer/update-profile"
            style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Update Profile
          </Link>
        </div>
        <DashboardContent stats={stats} history={history} role="lawyer" isLoading={isLoading} />
      </div>
    );
}
