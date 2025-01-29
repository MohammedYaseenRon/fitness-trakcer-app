import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

// Initialize Gemini AI
const API_KEY = process.env.GOOGLE_API_KEY;

async function generateMealSuggestionsWithGemini(userProfile: {
    dailyCalories: number;
    numberOfMeals: number;
    dietaryPreferences: string[];
    allergies: string[];
    weightGoal: string;
    activityLevel: string;
}) {
    const genAI = new GoogleGenerativeAI(API_KEY as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate ${userProfile.numberOfMeals} healthy meal suggestions with the following requirements:
    - Total daily calories: ${userProfile.dailyCalories}
    - Dietary preferences: ${userProfile.dietaryPreferences.join(", ")}
    - Allergies to avoid: ${userProfile.allergies.join(", ")}
    - Weight goal: ${userProfile.weightGoal}
    - Activity level: ${userProfile.activityLevel}

    For each meal, provide:
    1. Name
    2. Brief description
    3. Calories
    4. Macronutrients (protein, carbs, fat in grams)
    5. List of ingredients
    6. Step-by-step cooking instructions

    Format the response as a JSON array with the following structure for each meal:
    [
      {
        "name": "Meal Name",
        "description": "Brief description",
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "ingredients": ["ingredient1", "ingredient2", ...],
        "instructions": ["step1", "step2", ...]
      }
    ]`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Raw Response:", text);

        // Clean the response
        const cleanedText = text
            .replace(/```json|```/g, '') // Remove JSON code block markers
            .replace(/"protein": (\d+)g/g, '"protein": $1') // Remove 'g' from protein
            .replace(/"carbs": (\d+)g/g, '"carbs": $1') // Remove 'g' from carbs
            .replace(/"fat": (\d+)g/g, '"fat": $1') // Remove 'g' from fat
            .trim();

        console.log("Cleaned Response:", cleanedText);

        // Validate JSON format
        const isValidJSON = (jsonString: string) => {
            try {
                JSON.parse(jsonString);
                return true;
            } catch (error) {
                console.error("Invalid JSON:", error);
                return false;
            }
        };

        if (!isValidJSON(cleanedText)) {
            throw new Error("Invalid JSON format in Gemini response");
        }

        // Parse the cleaned JSON
        const meals = JSON.parse(cleanedText);

        // Round macronutrient values
        return meals.map((meal: any) => ({
            name: meal.name,
            description: meal.description,
            calories: Math.round(meal.calories),
            protein: Math.round(meal.protein),
            carbs: Math.round(meal.carbs),
            fat: Math.round(meal.fat),
            ingredients: meal.ingredients || [],
            instructions: meal.instructions || []
        }));
    } catch (error) {
        console.error("Error generating meals with Gemini:", error);
        throw new Error("Failed to generate meal suggestions");
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Generate default meals if no meals exist
        const meals = await generateMealSuggestionsWithGemini({
            dailyCalories: user.dailyCalories || 2000, // Default to 2000 calories if null
            numberOfMeals: user.numberOfMeals || 3, // Default to 3 meals if null
            dietaryPreferences: user.dietaryPreferences || [], // Default to an empty array if null
            allergies: user.allergies || [], // Default to an empty array if null
            weightGoal: user.weightGoal || "maintain", // Default to "maintain" if null
            activityLevel: user.activityLevel || "moderate", // Default to "moderate" if null
        });

        return NextResponse.json(
            {
                success: true,
                meals: meals.map((meal: any, index: any) => ({
                    id: `meal-${index + 1}`,
                    ...meal
                }))
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching meals:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userData = await req.json();

        // Generate meals using Gemini
        const meals = await generateMealSuggestionsWithGemini({
            dailyCalories: userData.dailyCalories,
            numberOfMeals: userData.numberOfMeals,
            dietaryPreferences: userData.dietaryPreferences,
            allergies: userData.allergies,
            weightGoal: userData.weightGoal,
            activityLevel: userData.activityLevel
        });

        // Add unique IDs to meals
        const mealsWithIds = meals.map((meal: any, index: any) => ({
            id: `meal-${Date.now()}-${index}`,
            ...meal
        }));

        return NextResponse.json(
            {
                success: true,
                meals: mealsWithIds
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error generating meals:", error);
        return NextResponse.json(
            { message: "Failed to generate meal suggestions" },
            { status: 500 }
        );
    }
}