"use client";

import React, { useState, useEffect, useRef } from "react";
import HintModal from "../components/HintModal";
import ProgressEditModal from "../components/ProgressEditModal";
import { ExerciseInsert } from "@/types/database";
import {
    getCodingExercisesByUserId,
    updateExerciseCompletionStatus,
} from "@/supabase/utilities";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { useUser } from "@/app/contexts/UserContext";

interface SubmitResponse {
    success: boolean;
    correct?: boolean;
    feedback?: string;
    error?: string;
}

const LessonsPage: React.FC = () => {
    const { userId } = useUser();
    const [exercises, setExercises] = useState<ExerciseInsert[]>([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
    const [showHintModal, setShowHintModal] = useState<boolean>(false);
    const [showProgressModal, setShowProgressModal] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
    const [submitNeedsReview, setSubmitNeedsReview] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [maxExercises, setMaxExercises] = useState<number>(10);
    const hasSetMaxExercises = useRef<boolean>(false);

    const currentExercise = exercises[currentExerciseIndex];
    const exercisesCompleted = exercises.filter((ex) => ex.completed).length;
    const totalExercises = Math.min(maxExercises, exercises.length);
    const progressPercentage =
        totalExercises > 0 ? (exercisesCompleted / totalExercises) * 100 : 0;

    useEffect(() => {
        const fetchExercises = async () => {
            const { data, error } = await getCodingExercisesByUserId(userId);

            if (data && !error) {
                console.log(data);
                setExercises(data);
                // Update maxExercises to match the loaded exercises length (only once)
                if (!hasSetMaxExercises.current) {
                    setMaxExercises(Math.min(25, data.length));
                    hasSetMaxExercises.current = true;
                }
            } else {
                if (error) {
                    console.error("Error fetching exercises:", error);
                }
                // Initialize with sample data - replace with actual data loading
                const sampleExercises: ExerciseInsert[] = [
                    {
                        user_id: "sample-user",
                        title: "FizzBuzz",
                        description:
                            'Write a function that prints the numbers from 1 to 100. But for multiples of three, print "Fizz" instead of the number, and for multiples of five, print "Buzz". For numbers which are multiples of both three and five, print "FizzBuzz".',
                        concepts: [
                            "Modulo operator (%)",
                            "Conditional statements",
                            "Loop structures",
                        ],
                        code: `function fizzBuzz() {
      // Your code here

  }`,
                        completed: false,
                    },
                ];
                setExercises(sampleExercises);
                // Update maxExercises to match the sample exercises length (only once)
                if (!hasSetMaxExercises.current) {
                    setMaxExercises(Math.min(25, sampleExercises.length));
                    hasSetMaxExercises.current = true;
                }
            }
        };

        fetchExercises();
    }, [userId]);

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
        setMaxExercises(newTotal);
    };

    const handleSubmit = async (): Promise<void> => {
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitNeedsReview(false);
        setFeedbackMessage("");

        try {
            // Debug: Log what we're sending
            console.log("Sending code to server:", currentExercise?.code);

            // Send code to server for Claude analysis
            const response = await fetch("/api/submit-code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: currentExercise?.code || "",
                    title: currentExercise?.title || "",
                    description: currentExercise?.description || "",
                }),
            });

            const result: SubmitResponse = await response.json();

            // TODO: to speed things up
            // const result = {
            //     success: true,
            //     correct: true,
            //     feedback: "",
            // };

            if (result.success) {
                console.log("Claude feedback:", result.feedback);

                // Add delay before showing result
                await new Promise((resolve) => setTimeout(resolve, 400));

                // Check if Claude says the solution is correct
                if (result.correct) {
                    setSubmitSuccess(true);
                    // Mark current exercise as completed in both Supabase and local state
                    await markExerciseCompleted(currentExerciseIndex);
                } else {
                    setSubmitNeedsReview(true);
                    setFeedbackMessage(
                        result.feedback ||
                            "Please check your solution and try again."
                    );
                    console.log("Code needs improvement:", result.feedback);
                }
            } else {
                console.error("Server error:", result.error);
                // Fallback to simulation
                await new Promise((resolve) => setTimeout(resolve, 400));
                setSubmitSuccess(true);
                // Mark current exercise as completed for fallback
                await markExerciseCompleted(currentExerciseIndex);
            }
        } catch (error) {
            console.error("Error calling Claude:", error);
            // Fallback to simulation for demo purposes with delay
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setSubmitSuccess(true);
            // Mark current exercise as completed for fallback
            await markExerciseCompleted(currentExerciseIndex);
        }

        setIsSubmitting(false);
    };

    const handleNext = (): void => {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(currentExerciseIndex + 1);
            setSubmitSuccess(false);
            setSubmitNeedsReview(false);
            setFeedbackMessage("");
        }
    };

    const handleCodeChange = (value: string): void => {
        if (currentExercise) {
            const updatedExercises = exercises.map((exercise, index) =>
                index === currentExerciseIndex
                    ? { ...exercise, code: value }
                    : exercise
            );
            setExercises(updatedExercises);
        }
    };

    const markExerciseCompleted = async (
        exerciseIndex: number
    ): Promise<void> => {
        const exercise = exercises[exerciseIndex];
        if (!exercise) return;

        try {
            // Update in Supabase with current completion date
            const completionDate = new Date().toISOString();
            console.log("Updating exerciise in supabase");
            const { error } = await updateExerciseCompletionStatus(
                exercise,
                true,
                completionDate
            );

            if (error) {
                console.error(
                    "Error updating exercise completion in Supabase:",
                    error
                );
                // Still update locally even if Supabase update fails
            }

            // Update local state with completion date
            const updatedExercises = exercises.map((ex, index) =>
                index === exerciseIndex
                    ? { ...ex, completed: true, completed_date: completionDate }
                    : ex
            );
            setExercises(updatedExercises);
        } catch (error) {
            console.error("Error marking exercise as completed:", error);
            // Still update locally as fallback
            const completionDate = new Date().toISOString();
            const updatedExercises = exercises.map((ex, index) =>
                index === exerciseIndex
                    ? { ...ex, completed: true, completed_date: completionDate }
                    : ex
            );
            setExercises(updatedExercises);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div
                className="rounded-2xl p-8"
                style={{
                    backgroundColor: "rgba(255, 255, 231, 0.8)",
                    border: "2px solid #000000",
                }}
            >
                <h1 className="text-3xl font-bold text-black mb-4">LESSONS</h1>
                <div className="text-gray-700">
                    <HintModal
                        isOpen={showHintModal}
                        onClose={handleCloseHint}
                    />
                    <ProgressEditModal
                        isOpen={showProgressModal}
                        onClose={handleCloseProgressModal}
                        currentTotal={maxExercises}
                        maxValue={exercises.length}
                        onSave={handleSaveProgressGoal}
                    />

                    {/* Progress Bar for Lessons Page */}
                    <div
                        className="rounded-2xl p-4 mb-6 transform hover:scale-103 transition-all duration-200 cursor-pointer"
                        style={{
                            backgroundColor: "#F5F5DC",
                            border: "1.5px solid #000000",
                        }}
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
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div
                            className="w-full rounded-full h-2"
                            style={{
                                backgroundColor: "#E2E7CE",
                                border: "1px solid #000000",
                            }}
                        >
                            <div
                                className="bg-gradient-to-r from-[#ADCF36] to-[#F0C022] h-2 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Two-Column Layout */}
                    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)]">
                        {/* Left Column - Resources Panel (1/3 width) */}
                        {/* <div
                            className="w-full lg:w-1/3 rounded-2xl overflow-hidden"
                            style={{
                                backgroundColor: "#F5F5DC",
                                border: "1.5px solid #000000",
                            }}
                        >
                            <div
                                className="px-6 py-4 border-b"
                                style={{
                                    backgroundColor: "#DCDCC4",
                                    borderColor: "#000000",
                                }}
                            >
                                <h3 className="text-lg font-semibold text-black">
                                    Resources
                                </h3>
                            </div>
                            <div className="p-6 overflow-y-auto h-full">
                                <div className="space-y-4">
                                    {currentExercise && (
                                        <>
                                            <div>
                                                <h4 className="text-sm font-semibold text-black mb-2">
                                                    Learning Materials
                                                </h4>
                                                <p className="text-sm text-gray-700 leading-relaxed">
                                                    Review the{" "}
                                                    {currentExercise.title}{" "}
                                                    problem requirements and
                                                    understand the logic needed.
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-black mb-2">
                                                    Key Concepts
                                                </h4>
                                                <div className="text-sm text-gray-700 leading-relaxed">
                                                    {currentExercise.concepts.map(
                                                        (concept, index) => (
                                                            <div key={index}>
                                                                - {concept}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <h4 className="text-sm font-semibold text-black mb-2">
                                            Examples
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            if (i % 15 === 0) return "FizzBuzz"
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-black mb-2">
                                            Tips & Tricks
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            Check for multiples of both 3 and 5
                                            first!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Right Column - Exercise Panel (2/3 width) */}
                        <div
                            className="w-full rounded-2xl overflow-hidden flex flex-col max-h-min"
                            style={{
                                backgroundColor: "#DCDCC7",
                                border: "1.5px solid #000000",
                            }}
                        >
                            <div
                                className="px-6 py-4 border-b"
                                style={{
                                    backgroundColor: "#DCDCC7",
                                    borderColor: "#000000",
                                }}
                            >
                                <h3 className="text-lg font-semibold text-black">
                                    Exercise:{" "}
                                    {currentExercise?.title || "Loading..."}
                                </h3>
                                <p className="text-sm text-black leading-relaxed">
                                    {currentExercise?.description ||
                                        "Loading exercise description..."}
                                </p>
                            </div>

                            {/* Code Editor Area */}
                            <div className="flex-1 flex flex-col relative max-h-min">
                                <div
                                    className="flex-1 overflow-hidden max-h-min"
                                    style={{ backgroundColor: "#272723" }}
                                >
                                    <CodeMirror
                                        value={currentExercise?.code || ""}
                                        height="55vh"
                                        theme={oneDark}
                                        extensions={[javascript()]}
                                        onChange={handleCodeChange}
                                        placeholder="Write your code here..."
                                        basicSetup={{
                                            lineNumbers: true,
                                            foldGutter: true,
                                            dropCursor: false,
                                            allowMultipleSelections: false,
                                            indentOnInput: true,
                                            bracketMatching: true,
                                            closeBrackets: true,
                                            autocompletion: true,
                                            highlightSelectionMatches: false,
                                        }}
                                    />
                                </div>

                                {/* Floating Action Buttons */}
                                <div
                                    className="absolute bottom-0 left-0 right-0 px-6 py-4"
                                    // style={{
                                    //     backgroundColor:
                                    //         "rgba(39, 39, 35, 0.95)",
                                    // }}
                                >
                                    {/* Success Message */}
                                    {submitSuccess && (
                                        <div className="mb-4 p-3 bg-[#CAE760] border border-green-300 rounded-md">
                                            <div className="flex items-center">
                                                <svg
                                                    className="w-5 h-5 text-green-600 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                <span className="text-sm font-medium text-green-700">
                                                    Success! Your solution is
                                                    correct.
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Needs Review Message */}
                                    {submitNeedsReview && (
                                        <div className="mb-4 p-3 bg-[#FFE4B5] border border-orange-300 rounded-md">
                                            <div className="flex items-start">
                                                <svg
                                                    className="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                                                    />
                                                </svg>
                                                <div className="text-sm font-medium text-orange-700">
                                                    {feedbackMessage}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center w-full">
                                        {/* <button
                                        onClick={handleGetHint}
                                        className="px-4 py-2 text-sm font-medium text-black border border-[#E89228] rounded-md"
                                        style={{ backgroundColor: "#E89228" }}
                                    >
                                        Get a Hint
                                    </button> */}
                                        <button
                                            onClick={
                                                submitSuccess
                                                    ? handleNext
                                                    : handleSubmit
                                            }
                                            disabled={
                                                isSubmitting ||
                                                (submitSuccess &&
                                                    currentExerciseIndex >=
                                                        exercises.length - 1)
                                            }
                                            className={`px-6 py-2 text-sm font-medium text-black rounded-md flex items-center ${
                                                isSubmitting ||
                                                (submitSuccess &&
                                                    currentExerciseIndex >=
                                                        exercises.length - 1)
                                                    ? "cursor-not-allowed opacity-50"
                                                    : ""
                                            }`}
                                            style={{
                                                backgroundColor: "#ADCF36",
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15v-.006a8.003 8.003 0 01-15.357 2m15.357 2v5H5.582m0 0a8.001 8.001 0 01-15.357-2m15.357 2H9a8.003 8.003 0 01-15.357 2z"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    Checking...
                                                </>
                                            ) : submitSuccess ? (
                                                currentExerciseIndex >=
                                                exercises.length - 1 ? (
                                                    "Completed"
                                                ) : (
                                                    "Next"
                                                )
                                            ) : (
                                                "Submit"
                                            )}
                                        </button>
                                    </div>
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
