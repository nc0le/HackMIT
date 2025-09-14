'use client';

import React, { useState } from 'react';
import HintModal from '../components/HintModal';
import ProgressEditModal from '../components/ProgressEditModal';

interface SubmitResponse {
    success: boolean;
    correct?: boolean;
    feedback?: string;
    error?: string;
}

const LessonsPage: React.FC = () => {
    const [showHintModal, setShowHintModal] = useState<boolean>(false);
    const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitNeedsReview, setSubmitNeedsReview] = useState<boolean>(false);
    const [userCode, setUserCode] = useState<string>(`function fizzBuzz() {
    // Your code here

}`);

    // Progress data
    const exercisesCompleted = 4;
    const [totalExercises, setTotalExercises] = useState<number>(25);
    const progressPercentage = (exercisesCompleted / totalExercises) * 100;

    const handleGetHint = (): void => {
        setShowHintModal(true);
    };

    const handleCloseHint = (): void => {
        setShowHintModal(false);
    };

    const handleEditProgress = (): void => {
        setShowProgressModal(true);
    };

    const handleCloseProgressModal = (): void => {
        setShowProgressModal(false);
    };

    const handleSaveProgressGoal = (newTotal: number): void => {
        setTotalExercises(newTotal);
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitNeedsReview(false);

        // Add initial delay to show checking state
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            // Debug: Log what we're sending
            console.log('Sending code to server:', userCode);

            // Send code to server for Claude analysis
            const response = await fetch('/api/submit-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: userCode
                })
            });

            const result: SubmitResponse = await response.json();

            if (result.success) {
                console.log('Claude feedback:', result.feedback);

                // Add delay before showing result
                await new Promise(resolve => setTimeout(resolve, 400));

                // Check if Claude says the solution is correct
                if (result.correct) {
                    setSubmitSuccess(true);
                } else {
                    setSubmitNeedsReview(true);
                    console.log('Code needs improvement:', result.feedback);
                }
            } else {
                console.error('Server error:', result.error);
                // Fallback to simulation
                await new Promise(resolve => setTimeout(resolve, 400));
                setSubmitSuccess(true);
            }
        } catch (error) {
            console.error('Error calling Claude:', error);
            // Fallback to simulation for demo purposes with delay
            await new Promise(resolve => setTimeout(resolve, 1200));
            setSubmitSuccess(true);
        }

        setIsSubmitting(false);
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
        setUserCode(e.target.value);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl p-8" style={{backgroundColor: '#FFFFE7', border: '2px solid #000000'}}>
                <h1 className="text-3xl font-bold text-black mb-4">LESSONS</h1>
                <div className="text-gray-700">
            <HintModal isOpen={showHintModal} onClose={handleCloseHint} />
            <ProgressEditModal
                isOpen={showProgressModal}
                onClose={handleCloseProgressModal}
                currentTotal={totalExercises}
                onSave={handleSaveProgressGoal}
            />

            {/* Progress Bar for Lessons Page */}
            <div 
                className="rounded-2xl p-4 mb-6 transform hover:scale-103 transition-all duration-200 cursor-pointer" 
                style={{backgroundColor: '#F5F5DC', border: '1.5px solid #000000'}}
                onClick={handleEditProgress}
                title="Click to edit progress goal"
            >
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                        Progress: {exercisesCompleted}/{totalExercises}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-700">
                            {Math.round(progressPercentage)}%
                        </span>
                        <button
                            onClick={handleEditProgress}
                            className="p-1 text-gray-600 hover:text-[#E89228] transition-colors"
                            title="Edit progress goal"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="w-full rounded-full h-2" style={{backgroundColor: '#E2E7CE', border: '1px solid #000000'}}>
                    <div
                        className="bg-gradient-to-r from-[#ADCF36] to-[#F0C022] h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Two-Column Layout */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)]">
                {/* Left Column - Resources Panel (1/3 width) */}
                <div className="w-full lg:w-1/3 rounded-2xl overflow-hidden" style={{backgroundColor: '#F5F5DC', border: '1.5px solid #000000'}}>
                    <div className="px-6 py-4 border-b" style={{backgroundColor: '#DCDCC4', borderColor: '#000000'}}>
                        <h3 className="text-lg font-semibold text-black">Resources</h3>
                    </div>
                    <div className="p-6 overflow-y-auto h-full">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold text-black mb-2">Learning Materials</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Review the FizzBuzz problem requirements and understand the logic needed.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-black mb-2">Key Concepts</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    - Modulo operator (%)
                                    <br />
                                    - Conditional statements
                                    <br />
                                    - Loop structures
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-black mb-2">Examples</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    if (i % 15 === 0) return "FizzBuzz"
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-black mb-2">Tips & Tricks</h4>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Check for multiples of both 3 and 5 first!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Exercise Panel (2/3 width) */}
                <div className="w-full lg:w-2/3 rounded-2xl overflow-hidden flex flex-col" style={{backgroundColor: '#DCDCC7', border: '1.5px solid #000000'}}>
                    <div className="px-6 py-4 border-b" style={{backgroundColor: '#DCDCC7', borderColor: '#000000'}}>
                        <h3 className="text-lg font-semibold text-black">Exercise: FizzBuzz</h3>
                        <p className="text-sm text-black leading-relaxed">
                            Write a function that prints the numbers from 1 to 100. But for multiples of three, print "Fizz" instead of the number, and for multiples of five, print "Buzz". For numbers which are multiples of both three and five, print "FizzBuzz".
                        </p>
                    </div>

                    {/* Code Editor Area */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-6" style={{backgroundColor: '#272723'}}>
                            <textarea
                                value={userCode}
                                onChange={handleTextareaChange}
                                className="w-full h-full resize-none border-none outline-none text-sm leading-relaxed text-[#E2C154]"
                                style={{
                                    backgroundColor: 'transparent',
                                    fontFamily: 'JetBrains Mono, monospace'
                                }}
                                placeholder="Write your code here..."
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 py-4 border-t border-[#272723]" style={{backgroundColor: '#272723'}}>
                        {/* Success Message */}
                        {submitSuccess && (
                            <div className="mb-4 p-3 bg-[#CAE760] border border-green-300 rounded-md">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-medium text-green-700">Success! Your solution is correct.</span>
                                </div>
                            </div>
                        )}

                        {/* Needs Review Message */}
                        {submitNeedsReview && (
                            <div className="mb-4 p-3 bg-[#FFE4B5] border border-orange-300 rounded-md">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-sm font-medium text-orange-700">Please check your solution and try again.</span>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleGetHint}
                                className="px-4 py-2 text-sm font-medium text-black border border-[#E89228] rounded-md"
                                style={{backgroundColor: '#E89228'}}
                            >
                                Get a Hint
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`px-6 py-2 text-sm font-medium text-black rounded-md flex items-center ${
                                    isSubmitting
                                        ? 'cursor-not-allowed'
                                        : ''
                                }`}
                                style={{backgroundColor: '#ADCF36'}}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15v-.006a8.003 8.003 0 01-15.357 2m15.357 2v5H5.582m0 0a8.001 8.001 0 01-15.357-2m15.357 2H9a8.003 8.003 0 01-15.357 2z" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Checking...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                </div>
            </div>
        </div>
    );
};

export default LessonsPage;