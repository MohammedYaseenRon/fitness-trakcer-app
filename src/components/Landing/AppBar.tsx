"use client";

import React, { useState } from "react";
import { Menu, X, Activity } from 'lucide-react';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
    label: string;
    href: string;
}

const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" }
];

export const AppBar: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    const goToSignup = () => {
        router.push("/signup");
        setMenuOpen(false); // Close the menu after navigating
    };

    return (
        <div className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0">
                            <Activity className="h-8 w-8" />
                        </Link>
                    </div>
                        <div className="flex-grow flex justify-center">
                            <div className="hidden md:flex md:items-center md:space-x-8 ml-4">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${
                                            pathname === item.href
                                                ? 'text-white hover:border- bordb-2er-white'
                                                : 'text-white hover:border-b-2 hover:border-white'
                                        } text-base font-medium transition-all duration-300`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>

                    
                        </div>
                    <div className="ml-auto">
                        <button
                            onClick={goToSignup}
                            className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white"
                        >
                            {menuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden fixed inset-0 bg-blue-800 bg-opacity-90 z-50 flex flex-col items-center justify-center">
                        <div className="px-4 py-4 space-y-4 flex-grow overflow-auto">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={toggleMenu} // Close menu on item click
                                    className={`${
                                        pathname === item.href
                                            ? 'text-white border-b-2 border-white'
                                            : 'text-white hover:border-b-2 hover:border-white'
                                    } block text-base font-medium transition-all duration-300`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={goToSignup}
                                className="block px-4 py-2 rounded-md text-base font-medium bg-white text-blue-600 hover:bg-blue-100"
                            >
                                Sign Up
                            </button>
                        </div>
                        <button
                            onClick={toggleMenu}
                            className="absolute top-4 right-4 text-white"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
