import React from 'react';

const Summary = () => {
    // Dashboard data
    const dashboardData = {
        totalSessions: 18,
        mostFrequentTopic: 'React Hooks',
        overallEfficiency: '82%'
    };

    // Weekly progress data (heights as percentages)
    const weeklyProgress = [
        { day: 'Mon', height: 65 },
        { day: 'Tue', height: 80 },
        { day: 'Wed', height: 45 },
        { day: 'Thu', height: 90 },
        { day: 'Fri', height: 75 },
        { day: 'Sat', height: 55 },
        { day: 'Sun', height: 70 }
    ];

    return (
        <div className="mt-6 space-y-6">
            <p className="text-lg">
                Welcome to the SUMMARY page. This content area will display different information based on your navigation selection.
            </p>
            <h2 className="text-xl font-semibold text-black">Your Stats</h2>
            
            {/* Dashboard Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Sessions Card */}
                <div className="rounded-lg p-6 transform hover:scale-105 transition-all duration-200 bg-[#F5F5DC] border-2 border-black">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Total Sessions</p>
                            <p className="text-3xl font-bold text-black mt-2">{dashboardData.totalSessions}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Most Frequent Topic Card */}
                <div className="rounded-lg p-6 transform hover:scale-105 transition-all duration-200 bg-[#F5F5DC] border-2 border-black">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Most Frequent Topic</p>
                            <p className="text-xl font-bold text-black mt-2">{dashboardData.mostFrequentTopic}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Overall Efficiency Card */}
                <div className="rounded-lg p-6 transform hover:scale-105 transition-all duration-200 bg-[#F5F5DC] border-2 border-black">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Overall Efficiency</p>
                            <p className="text-3xl font-bold text-black mt-2">{dashboardData.overallEfficiency}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Progress Chart */}
            <div className="rounded-2xl p-6" style={{backgroundColor: '#F5F5DC', border: '1.5px solid #000000'}}>
                <h3 className="text-lg font-semibold text-black mb-4">Weekly Progress</h3>
                <div className="flex items-end justify-between h-32 space-x-2">
                    {weeklyProgress.map((day, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                                className="w-full bg-gradient-to-t from-[#E89228] to-[#E89228] rounded-t-md"
                                style={{ height: `${day.height}%` }}
                            ></div>
                            <span className="text-xs text-gray-700 mt-2 font-medium">{day.day}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Summary;
