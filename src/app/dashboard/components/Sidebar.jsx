
'use client';

import { usePathname } from "next/navigation";
import { Bars, Bell, Envelope, Gear, House, Magnifier, Person, Sliders } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export function DashboardSidebar() {
    const pathname = usePathname();

    // const navItems = [
    //     { icon: House, label: "Home", href: "/dashboard" },
    //     { icon: Magnifier, label: "Search", href: "/lawyers" },
    //     { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
    //     { icon: Envelope, label: "Messages", href: "/dashboard/messages" },
    //     { icon: Gear, label: "Settings", href: "/dashboard/settings" },
    // ];

    const userLinks = [
        { label: "Profile", href: "/dashboard/user" },
        { label: "Comments", href: "/dashboard/user/comments" },
        { label: "Hiring History", href: "/dashboard/user/hiring-history" },
        { label: "Update Profile", href: "/dashboard/user/update-profile" },
    ];

    const lawyerLinks = [
        { label: "Profile", href: "/dashboard/lawyer" },
        { label: "Hiring History", href: "/dashboard/lawyer/hiring-history" },
        { label: "Manage Legal Profile", href: "/dashboard/lawyer/manage-legal-profile" },
    ];

    const adminLinks = [
        { label: "Overview", href: "/dashboard/admin" },
        { label: "Manage Users", href: "/dashboard/admin/manage-users" },
        { label: "All Transactions", href: "/dashboard/admin/all-transactions" },
        { label: "Analytics", href: "/dashboard/admin/analytics" },
    ];

    // Determine which section the user is in
    const isUserDashboard = pathname.startsWith("/dashboard/user");
    const isLawyerDashboard = pathname.startsWith("/dashboard/lawyer");
    const isAdminDashboard = pathname.startsWith("/dashboard/admin");

    // Get the appropriate dashboard links
    let dashboardLinks = [];
    let dashboardTitle = "";

    if (isUserDashboard) {
        dashboardLinks = userLinks;
        dashboardTitle = "User Dashboard";
    } else if (isLawyerDashboard) {
        dashboardLinks = lawyerLinks;
        dashboardTitle = "Lawyer Dashboard";
    } else if (isAdminDashboard) {
        dashboardLinks = adminLinks;
        dashboardTitle = "Admin Dashboard";
    }

    const navContent = (
        <nav className="flex flex-col gap-2">
            {/* {navItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                </Link>
            ))} */}

            {dashboardLinks.length > 0 && (
                <>
                    <div className="my-2 border-t border-default" />
                    <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-muted uppercase tracking-wide">{dashboardTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        {dashboardLinks.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-default-500 transition-colors hover:text-foreground hover:bg-default"
                            >
                                <div className="size-1.5 rounded-full bg-default-400" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </nav>
    );

    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r lg:block">
                <div className="flex h-full flex-col gap-6 p-4">
                    {navContent}
                </div>
            </aside>
            <Drawer>
                <Button className="lg:hidden" variant="secondary">
                    <Bars />
                    Menu
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>

                                {navContent}

                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>

        </>
    );
}