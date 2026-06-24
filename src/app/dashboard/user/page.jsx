"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import DashboardContent from "@/app/dashboard/components/DashboardContent";
import { useSession } from '@/lib/auth-client';
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

const stats = [
  { label: "Saved Lawyers", value: 8 },
  { label: "Upcoming Consultations", value: 2 },
  { label: "Past Consultations", value: 14 },
];

const history = [
  {
    title: "Booked Alexandra Chen",
    description: "Corporate Law consultation confirmed for Jun 25, 2026 at 10:00 AM",
    date: "Jun 22",
  },
  {
    title: "Booking cancelled",
    description: "Consultation with David Okonkwo was cancelled",
    date: "Jun 20",
  },
  {
    title: "Reviewed Marcus Rivera",
    description: "Left a 5-star review after criminal law consultation",
    date: "Jun 18",
  },
];

export default function UserDashboard() {
    const { data: session, isPending } = useSession();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      if (!isPending) {
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
      }
    }, [isPending]);

    if (isPending || isLoading) {
        return <LoadingSpinner size="lg" />;
    }
  return (
    <div>
      <style>{`
        .ud-header {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          justify-content: space-between;
          padding: 16px 16px 0;
        }
        @media (min-width: 640px) { .ud-header { padding: 20px 24px 0; } }
        .ud-header h1 { margin: 0; font-size: 20px; font-weight: 700; color: #f8fafc; }
      `}</style>
      <div className="ud-header">
        <h1>Welcome, {session?.user?.name}</h1>
        <Link
          href="/dashboard/user/update-profile"
          style={{ padding: '8px 16px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Update Profile
        </Link>
      </div>
      <DashboardContent stats={stats} history={history} role="user" isLoading={isLoading} />
    </div>
  );
}