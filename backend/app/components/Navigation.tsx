'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationItem {
  name: string;
  href: string;
}

const Navigation: React.FC = () => {
    const pathname = usePathname();

    const navigationItems: NavigationItem[] = [
        { name: 'HOME', href: '/' },
        { name: 'SUMMARY', href: '/summary' },
        { name: 'LESSONS', href: '/lessons' },
        { name: 'LEADERBOARD', href: '/leaderboard' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{backgroundColor: '#FFFFE7', borderColor: '#000000'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Navigation Links */}
                    <div className="flex space-x-8">
                        {navigationItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'text-black border-b-2'
                                            : 'text-gray-700 hover:text-black'
                                    }`}
                                    style={isActive ? {borderBottomColor: '#F5F5DC', backgroundColor: '#F5F5DC'} : {}}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Account Icon */}
                    <div className="flex items-center">
                        <button className="p-2 rounded-full text-gray-700 hover:text-black transition-colors">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;