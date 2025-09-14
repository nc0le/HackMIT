'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';

interface NavigationItem {
  name: string;
  href: string;
}

const Navigation: React.FC = () => {
    const pathname = usePathname();
    const { userId, setUserId } = useUser();
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempUserId, setTempUserId] = useState(userId);

    const navigationItems: NavigationItem[] = [
        { name: 'HOME', href: '/' },
        { name: 'SUMMARY', href: '/summary' },
        { name: 'LESSONS', href: '/lessons' },
        { name: 'LEADERBOARD', href: '/leaderboard' }
    ];

    const handleProfileClick = () => {
        setTempUserId(userId);
        setIsEditingProfile(true);
    };

    const handleSaveProfile = () => {
        setUserId(tempUserId);
        setIsEditingProfile(false);
    };

    const handleCancelProfile = () => {
        setTempUserId(userId);
        setIsEditingProfile(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSaveProfile();
        } else if (e.key === 'Escape') {
            handleCancelProfile();
        }
    };

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

                    {/* User Profile */}
                    <div className="flex items-center">
                        {isEditingProfile ? (
                            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#F5F5DC', border: '1px solid #000000' }}>
                                <input
                                    type="text"
                                    value={tempUserId}
                                    onChange={(e) => setTempUserId(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    onBlur={handleSaveProfile}
                                    autoFocus
                                    className="px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[#ADCF36]"
                                    placeholder="Enter username"
                                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #000000', minWidth: '120px' }}
                                />
                                <button
                                    onClick={handleSaveProfile}
                                    className="px-2 py-1 text-xs rounded text-white hover:opacity-80"
                                    style={{ backgroundColor: '#ADCF36' }}
                                >
                                    ✓
                                </button>
                                <button
                                    onClick={handleCancelProfile}
                                    className="px-2 py-1 text-xs rounded text-white hover:opacity-80"
                                    style={{ backgroundColor: '#E89228' }}
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleProfileClick}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: '#F5F5DC', border: '1px solid #000000' }}
                            >
                                <svg
                                    className="w-5 h-5 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="text-sm font-medium text-black">
                                    {userId}
                                </span>
                                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;