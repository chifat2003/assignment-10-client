"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import links from './navlinks';

const Navbar = ({ user = null, onSignOut = null }) => {
    const [localUser, setLocalUser] = useState(user);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleSignOut = async () => {
        if (onSignOut) {
            await onSignOut();
        }
        setLocalUser(null);
    };

    return (
        <nav className="w-full bg-white border-b">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="w-8 h-8 inline-flex items-center justify-center bg-blue-600 text-white rounded">
                                {/* simple glyph */}
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                    <path fill="currentColor" d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4 7.1v6.9l8 4 8-4V7.1L12 9.5z" />
                                </svg>
                            </span>
                            <span className="text-xl font-semibold">MySite</span>
                        </Link>
                    </div>

                    {/* Center: Links */}
                    <div className="flex-1 flex items-center justify-center">
                        <div className="hidden sm:flex space-x-6">
                            {links.map((l) => (
                                <Link key={l.href} href={l.href} className="text-gray-700 hover:text-gray-900">
                                    {l.label}
                                </Link>
                            ))}
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
                        {localUser ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                            <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">{localUser.name || 'Account'}</span>
                                </div>
                                <button onClick={handleSignOut} className="px-3 py-1 bg-red-500 text-white rounded">
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link href="/signin" className="px-3 py-1 border rounded text-gray-700">Sign In</Link>
                                <Link href="/signup" className="px-3 py-1 bg-blue-600 text-white rounded">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile menu panel */}
            {mobileOpen && (
                <div className="sm:hidden border-t">
                    <div className="px-4 py-3 space-y-2">
                        {links.map((l) => (
                            <Link key={l.href} href={l.href} className="block px-2 py-1 text-gray-700 hover:bg-gray-50 rounded">
                                {l.label}
                            </Link>
                        ))}

                        {localUser ? (
                            <div className="pt-2 border-t mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-8 h-8 inline-flex items-center justify-center bg-gray-200 text-gray-700 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                                            <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"/>
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">{localUser.name || 'Account'}</span>
                                </div>
                                <button onClick={handleSignOut} className="px-3 py-1 bg-red-500 text-white rounded">Sign Out</button>
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