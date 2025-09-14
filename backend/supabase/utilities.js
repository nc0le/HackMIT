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
