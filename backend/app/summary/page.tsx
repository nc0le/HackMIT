import React from 'react';

interface DashboardData {
  totalSessions: number;
  mostFrequentTopic: string;
  skillDiagnosis: string;
  streakDays: number;
}

interface WeeklyProgressItem {
  day: string;
  height: number;
}

const SummaryPage: React.FC = () => {
    const dashboardData: DashboardData = {
        totalSessions: 18,
        mostFrequentTopic: 'React Hooks',
        skillDiagnosis: 'Beginner',
        streakDays: 7
    };

    const weeklyProgress: WeeklyProgressItem[] = [
        { day: 'Mon', height: 65 },
        { day: 'Tue', height: 80 },
        { day: 'Wed', height: 45 },
        { day: 'Thu', height: 90 },
        { day: 'Fri', height: 75 },
        { day: 'Sat', height: 55 },
        { day: 'Sun', height: 70 }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-8" style={{backgroundColor: '#FFFFE7', border: '2px solid #000000'}}>
                <h1 className="text-3xl font-bold text-black mb-4">SUMMARY</h1>
                <div className="text-gray-700 space-y-6">
            <p className="text-lg">
                Welcome to the SUMMARY page. This content area will display different information based on your navigation selection.
            </p>
            <h2 className="text-xl font-semibold text-black">Your Stats</h2>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Streak Card */}
                <div className="rounded-2xl p-6 bg-[#F5F5DC]" style={{border: '1.5px solid #000000'}}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Current Streak</p>
                            <p className="text-3xl font-bold text-black mt-2">{dashboardData.streakDays}</p>
                            <p className="text-xs text-gray-600">days</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Total Sessions Card */}
                <div className="rounded-2xl p-6 bg-[#F5F5DC]" style={{border: '1.5px solid #000000'}}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Total Exercises Solved</p>
                            <p className="text-3xl font-bold text-black mt-2">{dashboardData.totalSessions}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Skill Diagnosis Card */}
                <div className="rounded-2xl p-6 bg-[#F5F5DC]" style={{border: '1.5px solid #000000'}}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Skill Diagnosis</p>
                            <p className="text-xl font-bold text-black mt-2">{dashboardData.skillDiagnosis}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Progress Chart and Most Frequent Topic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Most Frequent Topic Card */}
                <div className="rounded-2xl p-6 transform hover:scale-105 transition-all duration-200 bg-[#F5F5DC]" style={{border: '1.5px solid #000000'}}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700">Most Frequently Asked About</p>
                            <p className="text-xl font-bold text-black mt-2">{dashboardData.mostFrequentTopic}</p>
                        </div>
                        <div className="p-3 rounded-full" style={{backgroundColor: '#E89228'}}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Weekly Recap - Spans 2 columns */}
                <div className="lg:col-span-2">
                    <div className="rounded-2xl p-6" style={{backgroundColor: '#F5F5DC', border: '1.5px solid #000000'}}>
                        <h3 className="text-lg font-semibold text-black mb-4">Weekly Recap</h3>
                        <div className="flex items-end justify-between h-32 space-x-2">
                            {weeklyProgress.map((day, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 h-full">
                                    <div className="w-full flex flex-col justify-end h-full items-center">
                                        <div
                                            className="w-[50px] bg-gradient-to-t from-[#A7CA4D] to-[#A7CA4D] rounded-t-md min-h-[8px]"
                                            style={{ height: `${day.height}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-700 mt-2 font-medium">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;