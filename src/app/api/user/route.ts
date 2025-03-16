import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

//Gemini ai
const API_KEY = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY as string);

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json(
            { message: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const {
            weight, gender, height, age, fitnessGoal, activityLevel,
            dailyCalories, dietaryPreferences, allergies, weightGoal,
            numberOfMeals, preferredWorkoutTime, workoutDaysPerWeek,
            workoutDuration, workoutLocation, availableEquipment
        } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                weight: parseFloat(weight),
                height: parseFloat(height),
                age: parseInt(age),
                gender,
                fitnessGoal,
                activityLevel,
                dailyCalories: parseInt(dailyCalories),
                dietaryPreferences, // Expecting an array
                allergies, // Expecting an array
                weightGoal,
                numberOfMeals: numberOfMeals ? parseInt(numberOfMeals) : null,
                preferredWorkoutTime,
                workoutDaysPerWeek: workoutDaysPerWeek ? parseInt(workoutDaysPerWeek) : null,
                workoutDuration: workoutDuration ? parseInt(workoutDuration) : null,
                workoutLocation,
                availableEquipment
            },
        });

        const prompt = `
    Create an awesome, motivating 7-day workout plan for a ${age}-year-old ${gender} who:
    - Weighs ${weight} lbs
    - Is ${height} inches tall
    - Has a fitness goal of ${fitnessGoal}
    - Has ${activityLevel} activity level
    - Wants to workout ${workoutDaysPerWeek} days per week
    - Can workout for ${workoutDuration} minutes
    - Prefers to workout at ${workoutLocation}
    - Has access to ${availableEquipment}
    - Prefers workout time: ${preferredWorkoutTime || 'any time'}

    Make the plan exciting and motivating! Include:
    - Daily workout names with a fun twist
    - Specific exercises (3-5 per day)
    - Sets and reps (use numeric values for reps, avoid ranges)
    - Rest periods (in seconds as numbers, e.g., 60, not "60s")
    - A motivational quote for each day
    - **For rest days,like Saturday and Sunday always include light activities (e.g., stretching, yoga, walking) instead of an empty list.**
    Return the response as pure JSON without any markdown, code blocks, or extra text, following this structure:
    {
        "workoutPlan": [
            {
                "day": "Day 1",
                "name": "Workout Name",
                "exercises": [
                    {"name": "Exercise", "sets": 3, "reps": 12, "rest": 60}
                ],
                "quote": "Motivational quote"
            }
        ]
    }
`;


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

        let workoutPlan;
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const workoutPlanText = await response.text();
            console.log(workoutPlanText);

            // Clean the response
            const extractJSON = (text: string) => {
                const jsonMatch = text.match(/\{[\s\S]*\}/); // Find JSON block
                return jsonMatch ? jsonMatch[0] : null;
            };

            let cleanedText = extractJSON(workoutPlanText);

            if (!cleanedText) {
                throw new Error('No valid JSON found in response');
            }


            try {
                workoutPlan = JSON.parse(cleanedText);
            } catch (parseError: any) {
                console.error('Error parsing cleaned Gemini response:', parseError);
                console.error('Cleaned response:', cleanedText);
                return NextResponse.json(
                    {
                        message: "Error parsing workout plan response",
                        error: parseError.message,
                        rawResponse: workoutPlanText,
                        cleanedResponse: cleanedText
                    },
                    { status: 500 }
                );
            }
        } catch (error: any) {
            console.error('Gemini API Error:', error);
            return NextResponse.json(
                {
                    message: "Error generating workout plan",
                    error: error.message
                },
                { status: 500 }
            );
        }

        const workoutPlanRecord = await prisma.workoutPlan.create({
            data: {
                userId: user.id,
                plan: workoutPlan,
                createdAt: new Date()
            }
        });

        return NextResponse.json(
            {
                success: true,
                message: 'User updated and workout plan generated successfully',
                data: {
                    user: updatedUser,
                    workoutPlan: workoutPlan.workoutPlan
                }
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}


// Define the structure stored in the 'plan' Json field
interface WorkoutPlanData {
  workoutPlan: {
    day: string;
    name: string;
    exercises: { name: string; sets: number; reps: number; rest: number }[];
    quote: string;
  }[];
}

// Type for the WorkoutPlan model
interface WorkoutPlanRecord {
  id: number;
  userId: number;
  plan: WorkoutPlanData;
  createdAt: Date;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const workoutPlanRecord = await prisma.workoutPlan.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }, // Get the most recent plan
    }) as WorkoutPlanRecord | null;

    return NextResponse.json({
      success: true,
      message: "Content fetched successfully",
      data: {
        user: user,
        workoutPlan: workoutPlanRecord?.plan.workoutPlan || [], // Access plan.workoutPlan safely
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error while fetching user details:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}