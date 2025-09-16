import { supabase } from "@/supabase/client";

/**
 * Fetches all coding exercises for a specific user from Supabase
 * @param {string} userId - The user ID to filter by
 * @returns {Promise<Object>} - The query result containing data and error
 */
export async function getCodingExercisesByUserId(userId) {
    const { data, error } = await supabase
        .from("coding_exercises")
        .select("*")
        .eq("user_id", userId);

    return { data, error };
}

/**
 * Fetches a specific concept for a user by title from Supabase
 * @param {string} userId - The user ID to filter by
 * @param {string} title - The concept title to match
 * @returns {Promise<Object>} - The query result containing data and error
 */
export async function getConceptByUserAndTitle(userId, title) {
    const { data, error } = await supabase
        .from("concepts")
        .select("*")
        .eq("user_id", userId)
        .eq("title", title);

    return { data, error };
}

/**
 * Updates the completed status of a coding exercise in Supabase
 * @param {Object} exercise - The ExerciseInsert object containing exercise details
 * @param {boolean} completed - The completion status to set
 * @param {string|null} completedDate - The completion date (ISO string) or null
 * @returns {Promise<Object>} - The query result containing data and error
 */
export async function updateExerciseCompletionStatus(
    exercise,
    completed,
    completedDate = null
) {
    const updateData = {
        completed: completed,
        completed_date: completed
            ? completedDate || new Date().toISOString()
            : null,
    };
    console.log(exercise);
    const { data, error } = await supabase
        .from("coding_exercises")
        .update(updateData)
        .eq("id", exercise.id);

    console.log(data);
    console.log(error);

    return { data, error };
}

/**
 * Fetches all concepts for a specific user from Supabase
 * @param {string} userId - The user ID to filter by
 * @returns {Promise<Object>} - The query result containing data and error
 */
export async function getAllConceptsByUserId(userId) {
    const { data, error } = await supabase
        .from("concepts")
        .select("*")
        .eq("user_id", userId);

    return { data, error };
}

/**
 * Calculates the average skill level across all concepts for a user
 * @param {string} userId - The user ID to calculate average skill level for
 * @returns {Promise<Object>} - Object containing averageSkillLevel and error (if any)
 */
export async function getAverageSkillLevel(userId) {
    try {
        const { data: concepts, error } = await getAllConceptsByUserId(userId);

        if (error) {
            return { averageSkillLevel: null, error };
        }

        if (!concepts || concepts.length === 0) {
            return { averageSkillLevel: 0, error: null };
        }

        // Calculate average skill level
        const totalSkillLevel = concepts.reduce((sum, concept) => {
            return sum + (concept.skill_level || 0);
        }, 0);

        const averageSkillLevel = totalSkillLevel / concepts.length;

        return {
            averageSkillLevel: Math.round(averageSkillLevel),
            error: null,
        };
    } catch (err) {
        return { averageSkillLevel: null, error: err };
    }
}

/**
 * Finds concepts for a user that have the most related coding exercises
 * @param {string} userId - The user ID to filter by
 * @returns {Promise<Object>} - Object containing conceptsWithExerciseCounts and error (if any)
 */
export async function getConceptsWithMostExercises(userId) {
    try {
        // Get all concepts for the user
        const { data: concepts, error: conceptsError } =
            await getAllConceptsByUserId(userId);

        if (conceptsError) {
            return { conceptsWithExerciseCounts: null, error: conceptsError };
        }

        if (!concepts || concepts.length === 0) {
            return { conceptsWithExerciseCounts: [], error: null };
        }

        // Get all coding exercises for the user
        const { data: exercises, error: exercisesError } =
            await getCodingExercisesByUserId(userId);

        if (exercisesError) {
            return { conceptsWithExerciseCounts: null, error: exercisesError };
        }

        if (!exercises || exercises.length === 0) {
            return {
                conceptsWithExerciseCounts: concepts.map((concept) => ({
                    ...concept,
                    exerciseCount: 0,
                })),
                error: null,
            };
        }
        console.log("countings");
        // Count how many exercises each concept appears in
        const conceptCounts = {};

        concepts.forEach((concept) => {
            conceptCounts[concept.title] = 0;
        });

        exercises.forEach((exercise) => {
            if (exercise.concepts && Array.isArray(exercise.concepts)) {
                exercise.concepts.forEach((conceptName) => {
                    if (conceptCounts.hasOwnProperty(conceptName)) {
                        conceptCounts[conceptName]++;
                    }
                });
            }
        });

        // Add exercise counts to concepts and sort by count (descending)
        const conceptsWithCounts = concepts
            .map((concept) => ({
                ...concept,
                exerciseCount: conceptCounts[concept.title] || 0,
            }))
            .sort((a, b) => b.exerciseCount - a.exerciseCount);

        return { conceptsWithExerciseCounts: conceptsWithCounts, error: null };
    } catch (err) {
        return { conceptsWithExerciseCounts: null, error: err };
    }
}

/**
 * Gets the total number of completed exercises for a user
 * @param {string} userId - The user ID to count completed exercises for
 * @returns {Promise<Object>} - Object containing completedCount and error (if any)
 */
export async function getCompletedExercisesCount(userId) {
    try {
        const { data: exercises, error } = await supabase
            .from("coding_exercises")
            .select("completed")
            .eq("user_id", userId)
            .eq("completed", true);

        if (error) {
            return { completedCount: null, error };
        }

        return {
            completedCount: exercises ? exercises.length : 0,
            error: null,
        };
    } catch (err) {
        return { completedCount: null, error: err };
    }
}

/**
 * Gets weekly progress data and current streak for a user
 * @param {string} userId - The user ID to analyze progress for
 * @returns {Promise<Object>} - Object containing weeklyProgress array, currentStreak number, and error (if any)
 */
export async function getUserProgressStats(userId) {
    try {
        // Get all completed exercises with completion dates
        const { data: exercises, error } = await supabase
            .from("coding_exercises")
            .select("completed_date")
            .eq("user_id", userId)
            .eq("completed", true)
            .not("completed_date", "is", null)
            .order("completed_date", { ascending: true });

        if (error) {
            return { weeklyProgress: null, currentStreak: null, error };
        }

        if (!exercises || exercises.length === 0) {
            const emptyWeeklyProgress = [
                { day: "Mon", height: 0 },
                { day: "Tue", height: 0 },
                { day: "Wed", height: 0 },
                { day: "Thu", height: 0 },
                { day: "Fri", height: 0 },
                { day: "Sat", height: 0 },
                { day: "Sun", height: 0 },
            ];
            return {
                weeklyProgress: emptyWeeklyProgress,
                currentStreak: 0,
                error: null,
            };
        }

        // Get current date info
        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
        );

        // Calculate weekly progress (last 7 days)
        const weeklyProgress = [];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const dailyCounts = {};

        // Initialize daily counts for the last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            dailyCounts[dateStr] = 0;
        }

        // Count exercises completed each day
        exercises.forEach((exercise) => {
            const completionDate = new Date(exercise.completed_date);
            const dateStr = completionDate.toISOString().split("T")[0];
            if (dailyCounts.hasOwnProperty(dateStr)) {
                dailyCounts[dateStr]++;
            }
        });

        // Convert to weekly progress format with proper day ordering (Mon-Sun)
        const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const maxCount = Math.max(...Object.values(dailyCounts), 1);

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = dayNames[date.getDay()];
            const dateStr = date.toISOString().split("T")[0];
            const count = dailyCounts[dateStr];

            // Convert count to height percentage (0-100)
            const height = Math.round((count / maxCount) * 100);

            weeklyProgress.push({
                day: dayName,
                height: Math.max(height, count > 0 ? 20 : 0), // Minimum height of 20 for visual purposes if there's any activity
            });
        }

        // Reorder to start with Monday
        const reorderedProgress = [];
        orderedDays.forEach((dayName) => {
            const dayData = weeklyProgress.find((item) => item.day === dayName);
            if (dayData) {
                reorderedProgress.push(dayData);
            }
        });

        // Calculate current streak
        let currentStreak = 0;
        const completionDates = exercises.map(
            (ex) => new Date(ex.completed_date).toISOString().split("T")[0]
        );
        const uniqueDates = [...new Set(completionDates)].sort().reverse();

        // Check streak starting from today (or yesterday if nothing completed today)
        let checkDate = new Date(today);
        const todayStr = today.toISOString().split("T")[0];

        // If nothing completed today, start checking from yesterday
        if (!uniqueDates.includes(todayStr)) {
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Count consecutive days with completions
        while (true) {
            const checkDateStr = checkDate.toISOString().split("T")[0];
            if (uniqueDates.includes(checkDateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        return {
            weeklyProgress: reorderedProgress,
            currentStreak,
            error: null,
        };
    } catch (err) {
        return { weeklyProgress: null, currentStreak: null, error: err };
    }
}
