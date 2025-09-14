'use client';

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Link from 'next/link';

type PageName = 'SUMMARY' | 'LESSONS' | 'LEADERBOARD';

const App: React.FC = () => {
    const [activePage, setActivePage] = useState<PageName>('SUMMARY');

    const handleNavClick = (pageName: string) => {
        setActivePage(pageName as PageName);
    };

    const renderActivePage = () => {
        switch (activePage) {
            case 'SUMMARY':
                return (
                    <div className="space-y-4">
                        <p>Welcome to the summary page!</p>
                        <Link href="/summary" className="text-blue-600 hover:text-blue-800">
                            Go to full Summary page →
                        </Link>
                    </div>
                );
            case 'LESSONS':
                return (
                    <div className="space-y-4">
                        <p>Ready to learn? Start with coding exercises!</p>
                        <Link href="/lessons" className="text-blue-600 hover:text-blue-800">
                            Go to Lessons page →
                        </Link>
                    </div>
                );
            case 'LEADERBOARD':
                return (
                    <div className="space-y-4">
                        <p>See how you stack up against your friends!</p>
                        <Link href="/leaderboard" className="text-blue-600 hover:text-blue-800">
                            Go to Leaderboard page →
                        </Link>
                    </div>
                );
            default:
                return <div>Summary content coming soon...</div>;
        }
    };

    return (
        <div className="min-h-screen relative" style={{backgroundColor: '#FFFFE7'}}>
            {/* Grid Background Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
            ></div>

            <Navigation activePage={activePage} onNavClick={handleNavClick} />

            {/* Content Area */}
            <main className="pt-16">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl p-8" style={{backgroundColor: '#FFFFE7', border: '2px solid #000000'}}>
                        <h1 className="text-3xl font-bold text-black mb-4">
                            {activePage}
                        </h1>
                        <div className="text-gray-700">
                            {renderActivePage()}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;