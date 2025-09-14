import React from 'react';

const Navigation = ({ activePage, onNavClick }) => {
    const navigationItems = [
        { name: 'SUMMARY', id: 'summary' },
        { name: 'LESSONS', id: 'lessons' },
        { name: 'LEADERBOARD', id: 'leaderboard' }
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b" style={{backgroundColor: '#FFFFE7', borderColor: '#000000'}}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Navigation Links */}
                    <div className="flex space-x-8">
                        {navigationItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onNavClick(item.name)}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    activePage === item.name
                                        ? 'text-black border-b-2'
                                        : 'text-gray-700'
                                }`}
                                style={activePage === item.name ? {borderBottomColor: '#F5F5DC', backgroundColor: '#F5F5DC'} : {}}
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    {/* User Account Icon */}
                    <div className="flex items-center">
                        <button className="p-2 rounded-full text-gray-700">
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
