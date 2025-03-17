import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();

// Initialize Gemini AI
const API_KEY = process.env.GOOGLE_API_KEY;

export async function generateMealSuggestionsWithGemini(userProfile: {
    numberOfMeals: number;
    dietaryPreferences: string[];
    allergies: string[];
    weightGoal: string;
    activityLevel: string;
    gender:string,
    dailyCalories?: number; // Ensure it exists (added fallback)
}) {
    const genAI = new GoogleGenerativeAI(API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 🔹 Ensure values are formatted correctly
    const dietaryPreferences = userProfile.dietaryPreferences?.length
        ? userProfile.dietaryPreferences.join(", ")
        : "None";
    const allergies = userProfile.allergies?.length ? userProfile.allergies.join(", ") : "None";
    const dailyCalories = userProfile.dailyCalories || 2000; // Default to 2000 kcal if missing

    // 🔹 Improved Prompt
    const prompt = `Generate ${userProfile.numberOfMeals} healthy meal suggestions with the following requirements:
    - Total daily calories: ${dailyCalories}
    - Dietary preferences: ${dietaryPreferences}
    - Allergies to avoid: ${allergies}
    - Weight goal: ${userProfile.weightGoal}
    - Activity level: ${userProfile.activityLevel}

    Each meal should include:
    1. Name
    2. Brief description
    3. Calories (number, no null values)
    4. Macronutrients (protein, carbs, fat in grams, no null values)
    5. List of ingredients
    6. Step-by-step cooking instructions

    **Return only valid JSON**, no explanations or markdown.  
    Use this format:
    [
      {
        "name": "Meal Name",
        "description": "Brief description",
        "calories": 450,
        "protein": 30,
        "carbs": 50,
        "fat": 10,
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": ["step1", "step2"]
      }
    ]`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("🔹 Raw Response:", text);

        // 🔹 Extract JSON (handle unexpected text)
        const jsonMatch = text.match(/\[[\s\S]*\]/); 
        if (!jsonMatch) throw new Error("Invalid JSON response from Gemini");

        let cleanedText = jsonMatch[0]
            .replace(/"protein": (\d+)g/g, '"protein": $1') // Remove 'g' from protein
            .replace(/"carbs": (\d+)g/g, '"carbs": $1') // Remove 'g' from carbs
            .replace(/"fat": (\d+)g/g, '"fat": $1') // Remove 'g' from fat
            .trim();

        console.log("🔹 Cleaned Response:", cleanedText);

        // 🔹 Parse JSON & Validate
        let meals;
        try {
            meals = JSON.parse(cleanedText);
            if (!Array.isArray(meals)) throw new Error("Response is not an array");
        } catch (error) {
            console.error("❌ JSON Parsing Error:", error);
            throw new Error("Failed to parse Gemini response");
        }

        // 🔹 Ensure no `null` values in macronutrients
        return meals.map((meal: any) => ({
            name: meal.name || "Unknown Meal",
            description: meal.description || "No description available",
            calories: typeof meal.calories === "number" ? Math.round(meal.calories) : 0,
            protein: typeof meal.protein === "number" ? Math.round(meal.protein) : 0,
            carbs: typeof meal.carbs === "number" ? Math.round(meal.carbs) : 0,
            fat: typeof meal.fat === "number" ? Math.round(meal.fat) : 0,
            ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
            instructions: Array.isArray(meal.instructions) ? meal.instructions : []
        }));

    } catch (error) {
        console.error("❌ Error generating meals with Gemini:", error);
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
            gender:user.gender || "MALE"
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
        console.log(userData);

        // Generate meals using Gemini
        const meals = await generateMealSuggestionsWithGemini({
            dailyCalories: userData.dailyCalories,
            numberOfMeals: userData.numberOfMeals,
            dietaryPreferences: userData.dietaryPreferences,
            allergies: userData.allergies,
            weightGoal: userData.weightGoal,
            activityLevel: userData.activityLevel,
            gender:userData.gender
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