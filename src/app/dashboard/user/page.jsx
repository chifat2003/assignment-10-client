"use client";

import React from "react";
import DashboardContent from "@/app/dashboard/components/DashboardContent";
import { useSession } from '@/lib/auth-client';

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
        if (isPending) {
            return <div>Loading...</div>;
        }
  return (
    <div>
              <h1 className="text-center py-4">Welcome {session?.user?.name}</h1>
  <DashboardContent stats={stats} history={history} role="user" />
  </div>
);
}