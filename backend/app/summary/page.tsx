"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/app/contexts/UserContext";
import {
    getAverageSkillLevel,
    getCompletedExercisesCount,
    getConceptsWithMostExercises,
    getUserProgressStats,
} from "@/supabase/utilities";

interface DashboardData {
    totalSessions: number;
    mostFrequentTopic: string;
    skillDiagnosis: string;
    streakDays: number;
}

interface SkillLevel {
    level: number;
    label: string;
    description: string;
}

interface WeeklyProgressItem {
    day: string;
    height: number;
}

const SummaryPage: React.FC = () => {
    const { userId } = useUser();
    const [skillLevel, setSkillLevel] = useState<number>(1);
    const [isLoadingSkill, setIsLoadingSkill] = useState<boolean>(true);
    const [completedExercises, setCompletedExercises] = useState<number>(0);
    const [isLoadingExercises, setIsLoadingExercises] = useState<boolean>(true);
    const [topConcepts, setTopConcepts] = useState<any[]>([]);
    const [isLoadingConcepts, setIsLoadingConcepts] = useState<boolean>(true);
    const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressItem[]>(
        []
    );
    const [currentStreak, setCurrentStreak] = useState<number>(0);
    const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);

    // Dynamic dashboard data
    const dashboardData: DashboardData = {
        totalSessions: completedExercises,
        mostFrequentTopic: "React Hooks",
        skillDiagnosis: getSkillDiagnosisLabel(skillLevel),
        streakDays: currentStreak,
    };

    // Skill level mapping function
    function getSkillDiagnosisLabel(level: number): string {
        switch (level) {
            case 1:
                return "Beginner";
            case 2:
                return "Novice";
            case 3:
                return "Intermediate";
            case 4:
                return "Advanced";
            case 5:
                return "Master";
            default:
                return "Beginner";
        }
    }

    // Map average skill level to diagnosis level (1-5)
    function mapAverageToLevel(averageSkill: number): number {
        if (averageSkill >= 9) return 5; // Master (9-10)
        if (averageSkill >= 7) return 4; // Advanced (7-8.99)
        if (averageSkill >= 5) return 3; // Intermediate (5-6.99)
        if (averageSkill >= 3) return 2; // Novice (3-4.99)
        return 1; // Beginner (0-2.99)
    }

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoadingSkill(true);
            setIsLoadingExercises(true);
            setIsLoadingConcepts(true);
            setIsLoadingProgress(true);

            try {
                // Fetch all data in parallel
                const [
                    skillResult,
                    exerciseResult,
                    conceptsResult,
                    progressResult,
                ] = await Promise.all([
                    getAverageSkillLevel(userId),
                    getCompletedExercisesCount(userId),
                    getConceptsWithMostExercises(userId),
                    getUserProgressStats(userId),
                ]);

                // Handle skill level result
                if (skillResult.error) {
                    console.error(
                        "Error fetching average skill level:",
                        skillResult.error
                    );
                    setSkillLevel(1); // Default to beginner on error
                } else {
                    const mappedLevel = mapAverageToLevel(
                        skillResult.averageSkillLevel || 0
                    );
                    setSkillLevel(mappedLevel);
                }

                // Handle completed exercises result
                if (exerciseResult.error) {
                    console.error(
                        "Error fetching completed exercises count:",
                        exerciseResult.error
                    );
                    setCompletedExercises(0); // Default to 0 on error
                } else {
                    setCompletedExercises(exerciseResult.completedCount || 0);
                }

                // Handle top concepts result
                if (conceptsResult.error) {
                    console.error(
                        "Error fetching top concepts:",
                        conceptsResult.error
                    );
                    setTopConcepts([]); // Default to empty array on error
                } else {
                    // Get top 3 concepts with exercise counts > 0
                    const top3 = (
                        conceptsResult.conceptsWithExerciseCounts || []
                    )
                        .filter((concept) => concept.exerciseCount > 0)
                        .slice(0, 3);
                    setTopConcepts(top3);
                }

                // Handle progress stats result
                if (progressResult.error) {
                    console.error(
                        "Error fetching progress stats:",
                        progressResult.error
                    );
                    // Set default values on error
                    setCurrentStreak(0);
                    setWeeklyProgress([
                        { day: "Mon", height: 0 },
                        { day: "Tue", height: 0 },
                        { day: "Wed", height: 0 },
                        { day: "Thu", height: 0 },
                        { day: "Fri", height: 0 },
                        { day: "Sat", height: 0 },
                        { day: "Sun", height: 0 },
                    ]);
                } else {
                    setCurrentStreak(progressResult.currentStreak || 0);
                    setWeeklyProgress(progressResult.weeklyProgress || []);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setSkillLevel(1);
                setCompletedExercises(0);
                setTopConcepts([]);
                setCurrentStreak(0);
                setWeeklyProgress([
                    { day: "Mon", height: 0 },
                    { day: "Tue", height: 0 },
                    { day: "Wed", height: 0 },
                    { day: "Thu", height: 0 },
                    { day: "Fri", height: 0 },
                    { day: "Sat", height: 0 },
                    { day: "Sun", height: 0 },
                ]);
            } finally {
                setIsLoadingSkill(false);
                setIsLoadingExercises(false);
                setIsLoadingConcepts(false);
                setIsLoadingProgress(false);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div
                className="rounded-2xl p-8"
                style={{
                    backgroundColor: "rgba(255, 255, 231, 0.8)",
                    border: "2px solid #000000",
                }}
            >
                <h1 className="text-3xl font-bold text-black mb-4">SUMMARY</h1>
                <div className="text-gray-700 space-y-6">
                    <h2 className="text-xl font-semibold text-black">
                        Your Stats
                    </h2>

                    {/* Dashboard Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Current Streak Card */}
                        <div
                            className="rounded-2xl p-6 bg-[#F5F5DC]"
                            style={{ border: "1.5px solid #000000" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Current Streak
                                    </p>
                                    <p className="text-3xl font-bold text-black mt-2">
                                        {isLoadingProgress
                                            ? "Loading..."
                                            : dashboardData.streakDays}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        days
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-full"
                                    style={{ backgroundColor: "#E89228" }}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Total Sessions Card */}
                        <div
                            className="rounded-2xl p-6 bg-[#F5F5DC]"
                            style={{ border: "1.5px solid #000000" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Total Exercises Solved
                                    </p>
                                    <p className="text-3xl font-bold text-black mt-2">
                                        {isLoadingExercises
                                            ? "Loading..."
                                            : dashboardData.totalSessions}
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-full"
                                    style={{ backgroundColor: "#E89228" }}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Skill Diagnosis Card */}
                        <div
                            className="rounded-2xl p-6 bg-[#F5F5DC]"
                            style={{ border: "1.5px solid #000000" }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Skill Diagnosis
                                    </p>
                                    <p className="text-xl font-bold text-black mt-2">
                                        {isLoadingSkill
                                            ? "Loading..."
                                            : dashboardData.skillDiagnosis}
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-full"
                                    style={{ backgroundColor: "#E89228" }}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Progress Chart and Top Concepts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Top Concepts Card */}
                        {/* <div
                            className="rounded-2xl p-6 bg-[#F5F5DC]"
                            style={{ border: "1.5px solid #000000" }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        Most Frequently Practiced
                                    </p>
                                </div>
                                <div
                                    className="p-3 rounded-full"
                                    style={{ backgroundColor: "#E89228" }}
                                >
                                    <svg
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {isLoadingConcepts ? (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-600">Loading...</p>
                                </div>
                            ) : topConcepts.length > 0 ? (
                                <div className="space-y-3">
                                    {topConcepts.map((concept, index) => (
                                        <div key={concept.title} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                    style={{ backgroundColor: index === 0 ? '#ADCF36' : index === 1 ? '#F0C022' : '#E89228' }}
                                                >
                                                    {index + 1}
                                                </div>
                                                <span className="text-sm font-medium text-black">{concept.title}</span>
                                            </div>
                                            <span className="text-xs text-gray-600">{concept.exerciseCount} exercises</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm text-gray-600">No concepts practiced yet</p>
                                </div>
                            )}
                        </div> */}

                        {/* Weekly Recap - Spans 2 columns */}
                        <div className="lg:col-span-3">
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    backgroundColor: "#F5F5DC",
                                    border: "1.5px solid #000000",
                                }}
                            >
                                <h3 className="text-lg font-semibold text-black mb-4">
                                    Weekly Recap
                                </h3>
                                {isLoadingProgress ? (
                                    <div className="flex items-center justify-center h-32">
                                        <p className="text-sm text-gray-600">
                                            Loading...
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-end justify-between h-32 space-x-2">
                                        {weeklyProgress.map((day, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col items-center flex-1 h-full"
                                            >
                                                <div className="w-full flex flex-col justify-end h-full items-center">
                                                    <div
                                                        className="w-[50px] bg-gradient-to-t from-[#A7CA4D] to-[#A7CA4D] rounded-t-md min-h-[8px]"
                                                        style={{
                                                            height: `${day.height}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-700 mt-2 font-medium">
                                                    {day.day}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
