'use client';

import React from 'react';

interface LeaderboardUser {
  rank: number;
  userName: string;
  exercisesSolved: number;
  isCurrentUser: boolean;
}

const LeaderboardPage: React.FC = () => {
    const leaderboardData: LeaderboardUser[] = [
        { rank: 1, userName: 'Roy Lee', exercisesSolved: 47, isCurrentUser: false },
        { rank: 2, userName: 'Sarah Johnson', exercisesSolved: 42, isCurrentUser: false },
        { rank: 3, userName: 'You', exercisesSolved: 38, isCurrentUser: true },
        { rank: 4, userName: 'Phoebe Gates', exercisesSolved: 35, isCurrentUser: false },
        { rank: 5, userName: 'Emma Davis', exercisesSolved: 31, isCurrentUser: false },
        { rank: 6, userName: 'Garry Tan', exercisesSolved: 28, isCurrentUser: false },
        { rank: 7, userName: 'Lisa Park', exercisesSolved: 24, isCurrentUser: false }
    ];

    return (
        <div className="mt-6 space-y-6">
            {/* Leaderboard Table */}
            <div className="rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F5DC', border: '1.5px solid #000000'}}>
                <div className="px-6 py-4 border-b-[1.5px]" style={{backgroundColor: '#DCDCC4', borderColor: '#000000'}}>
                    <h3 className="text-lg font-semibold text-black">Friend Rankings</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full" style={{borderCollapse: 'separate', borderSpacing: 0}}>
                        <thead style={{backgroundColor: '#F5F5DC'}}>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    User Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Exercises Solved
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{backgroundColor: '#F5F5DC'}}>
                            {leaderboardData.map((user, index) => (
                                <tr
                                    key={index}
                                    style={{
                                        backgroundColor: user.isCurrentUser ? '#FCEDB7' : 'transparent',
                                        borderLeft: user.isCurrentUser ? '4px solid #E89228' : 'none'
                                    }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-black">
                                            #{user.rank}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(to right, #F0C022, #DC9642)', border: '2px solid #DC9642'}}>
                                                    <span className="text-sm font-medium text-white">
                                                        {user.userName.charAt(0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className={`text-sm font-medium ${
                                                    user.isCurrentUser ? 'text-black' : 'text-black'
                                                }`}
                                                style={user.isCurrentUser ? {color: '#DC9642'} : {}}>
                                                    {user.userName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className={`text-sm font-bold ${
                                                user.isCurrentUser ? 'text-black' : 'text-black'
                                            }`}
                                            style={user.isCurrentUser ? {color: '#000000'} : {}}>
                                                {user.exercisesSolved}
                                            </span>
                                            <span className="ml-1 text-sm text-gray-600">exercises</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;