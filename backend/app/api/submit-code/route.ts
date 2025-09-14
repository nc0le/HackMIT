import { NextRequest, NextResponse } from "next/server";
import { analyzeSolution } from "@/lib/claude";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { code } = body;
    try {
        const result = await analyzeSolution(code);
        console.log("Result returned!!!");
        console.log(result);
        return NextResponse.json({
            success: true,
            correct: result.correct,
            feedback: result.feedback,
        });
    } catch (error) {
        console.error("Error calling Claude:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
