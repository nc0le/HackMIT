'use client';

import React from 'react';
import Link from 'next/link';

const HomePage: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl p-8" style={{backgroundColor: '#FFFFE7'}}>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-black mb-6">
                                Welcome to Vibe Labs!
                            </h1>
                            <p className="text-lg text-gray-700 mb-8">
                                Your comprehensive coding education platform with interactive exercises, progress tracking, and community features.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                {/* Summary Card */}
                                <Link href="/summary" className="block">
                                    <div className="rounded-xl p-6 bg-[#F5F5DC] hover:scale-105 transition-transform duration-200 cursor-pointer h-48" style={{border: '1.5px solid #000000'}}>
                                        <div className="text-center">
                                            <div className="p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center" style={{backgroundColor: '#E89228'}}>
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-black mb-2">Summary</h3>
                                            <p className="text-gray-600">View your learning analytics</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Lessons Card */}
                                <Link href="/lessons" className="block">
                                    <div className="rounded-xl p-6 bg-[#F5F5DC] hover:scale-105 transition-transform duration-200 cursor-pointer h-48" style={{border: '1.5px solid #000000'}}>
                                        <div className="text-center">
                                            <div className="p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center" style={{backgroundColor: '#ADCF36'}}>
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-black mb-2">Lessons</h3>
                                            <p className="text-gray-600">Interactive coding exercises</p>
                                        </div>
                                    </div>
                                </Link>

                                {/* Leaderboard Card */}
                                <Link href="/leaderboard" className="block">
                                    <div className="rounded-xl p-6 bg-[#F5F5DC] hover:scale-105 transition-transform duration-200 cursor-pointer h-48" style={{border: '1.5px solid #000000'}}>
                                        <div className="text-center">
                                            <div className="p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center" style={{backgroundColor: '#F0C022'}}>
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-black mb-2">Leaderboard</h3>
                                            <p className="text-gray-600">Compare your progress with friends</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
        </div>
    );
};

export default HomePage;