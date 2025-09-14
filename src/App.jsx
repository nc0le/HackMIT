import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Summary from './pages/Summary';
import Lessons from './pages/Lessons';
import Leaderboard from './pages/Leaderboard';

function App() {
    const [activePage, setActivePage] = useState('SUMMARY');

    const handleNavClick = (pageName) => {
        setActivePage(pageName);
    };

    const renderActivePage = () => {
        switch (activePage) {
            case 'SUMMARY':
                return <Summary />;
            case 'LESSONS':
                return <Lessons />;
            case 'LEADERBOARD':
                return <Leaderboard />;
            default:
                return <Summary />;
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
}

export default App;
