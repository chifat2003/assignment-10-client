
'use client';

import { usePathname } from "next/navigation";
import { Bars, House } from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export function DashboardSidebar({ userRole }) {
    const pathname = usePathname();

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
        { label: "Update Profile", href: "/dashboard/lawyer/update-profile" },
    ];

    const adminLinks = [
        { label: "Overview", href: "/dashboard/admin" },
        { label: "Manage Users", href: "/dashboard/admin/manage-users" },
        { label: "All Transactions", href: "/dashboard/admin/all-transactions" },
        { label: "Analytics", href: "/dashboard/admin/analytics" },
    ];

    let dashboardLinks = [];
    let dashboardTitle = "";

    if (userRole === "admin") {
        dashboardLinks = adminLinks;
        dashboardTitle = "Admin Dashboard";
    } else if (userRole === "lawyer") {
        dashboardLinks = lawyerLinks;
        dashboardTitle = "Lawyer Dashboard";
    } else {
        dashboardLinks = userLinks;
        dashboardTitle = "User Dashboard";
    }

    const navContent = (
        <nav className="flex flex-col gap-2">
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
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:text-foreground hover:bg-default ${
                                    pathname === item.href
                                        ? "text-foreground bg-default font-medium"
                                        : "text-default-500"
                                }`}
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

            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3 border-b border-default bg-background/80 backdrop-blur-sm">
                <Drawer>
                    <Button size="sm" variant="flat">
                        <Bars className="size-4" />
                        <span className="text-sm">Menu</span>
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
                <span className="text-sm font-semibold text-foreground flex-1">{dashboardTitle}</span>
                <Link href="/" className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-default-500 transition-colors hover:text-foreground hover:bg-default">
                    <House className="size-4" />
                    <span>Home</span>
                </Link>
            </div>

            {/* Spacer so content isn't hidden under the fixed mobile bar */}
            <div className="lg:hidden h-14" />
        </>
    );
}