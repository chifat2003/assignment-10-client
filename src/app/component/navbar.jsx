"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import links from './navlinks';

const Navbar = () => {
    const router = useRouter();
    const { data: session, isPending } = useSession();
    const user = session?.user ?? null;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        localStorage.removeItem('user');
        router.push('/signin');
    };

    return (
        <nav className="w-full bg-gray-900 border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/Untitled design (4).png"
                                alt="LegalEase logo"
                                width={140}
                                height={40}
                                style={{ objectFit: "contain", height: 40, width: "auto" }}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center: Links */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="hidden sm:flex space-x-6">
                            {links.map((l) => {
                                // Show Dashboard only when user is logged in
                                if (l.label === 'Dashboard' && !user) {
                                    return null;
                                }
                                return (
                                    <Link key={l.href} href={l.href} className="text-gray-100 hover:text-underline">
                                        {l.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Auth */}
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen((s) => !s)}
                            className="sm:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>

                        {/* Desktop auth state */}
                        {isPending ? (
                            <div className="hidden sm:block w-20 h-8 bg-gray-100 animate-pulse rounded" />
                        ) : user ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || 'Profile'}
                                            className="w-8 h-8 rounded-full object-cover border border-blue-200"
                                        />
                                    ) : (
                                        <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                                            {(user.name || user.email || 'U')[0].toUpperCase()}
                                        </span>
                                    )}
                                    <span className="text-gray-100 font-medium">{user.name || user.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/signin" className="px-3 py-1 border rounded text-gray-700 hover:bg-gray-50">Sign In</Link>
                                <Link href="/signup" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileOpen && (
                <div className="sm:hidden border-t">
                    <div className="px-4 py-3 space-y-2">
                        {links.map((l) => {
                            // Show Dashboard only when user is logged in
                            if (l.label === 'Dashboard' && !user) {
                                return null;
                            }
                            return (
                                <Link key={l.href} href={l.href} className="block px-2 py-1 text-gray-700 hover:bg-gray-50 rounded">
                                    {l.label}
                                </Link>
                            );
                        })}

                        {user ? (
                            <div className="pt-2 border-t mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name || 'Profile'}
                                            className="w-8 h-8 rounded-full object-cover border border-blue-200"
                                        />
                                    ) : (
                                        <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                                            {(user.name || user.email || 'U')[0].toUpperCase()}
                                        </span>
                                    )}
                                    <span className="text-gray-100 font-medium">{user.name || user.email}</span>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="pt-2 border-t mt-2 flex gap-2">
                                <Link href="/signin" className="flex-1 text-center px-3 py-2 border rounded text-gray-700">Sign In</Link>
                                <Link href="/signup" className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;