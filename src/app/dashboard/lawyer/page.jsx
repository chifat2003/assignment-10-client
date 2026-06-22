"use client";

import React from "react";
import DashboardContent from "@/app/dashboard/components/DashboardContent";
import { useSession } from '@/lib/auth-client';


    


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
    if (isPending) {
        return <div>Loading...</div>;
    }
  return (

    

    <div>
      <h1 className="text-center py-4">Welcome {session?.user?.name}</h1>
      <DashboardContent stats={stats} history={history} role="lawyer" />
    </div>
  );
}
