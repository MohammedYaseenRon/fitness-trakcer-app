"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Meal {
    id: string;
    name: string;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: string[];
    instructions: string[];
}

interface User {
    name: string;
    age: number;
    height: number;
    weight: number;
    activityLevel: string;
    dietaryPreferences: string[];
    allergies: string[];
    weightGoal: string;
    numberOfMeals: number;
    dailyCalories: number;
}

export default function MealSuggestions() {
    const [meals, setMeals] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const { data: session, status } = useSession();

    const fetchUser = async () => {
        try {
            if (!session?.user?.email) return;
            const response = await fetch('/api/user');
            if (!response.ok) throw new Error('Failed to fetch user data');
            const userData = await response.json();
            setUser(userData.data);
        } catch (err) {
            setError('Failed to load user data. Please try again later.');
        }
    };

    const requestNewMeal = async () => {
        try {
            if (!user || !session?.user?.email) return;
            setLoading(true);
            setError(null);

            const response = await fetch("/api/meals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session.user.email,
                    age: user.age,
                    height: user.height,
                    weight: user.weight,
                    activityLevel: user.activityLevel,
                    dietaryPreferences: user.dietaryPreferences,
                    allergies: user.allergies,
                    weightGoal: user.weightGoal,
                    numberOfMeals: user.numberOfMeals,
                    dailyCalories: user.dailyCalories,
                }),
            });
            console.log(response);

            if (!response.ok) throw new Error('Failed to generate new meals');
            const data = await response.json();
            setMeals(data.meals);
        } catch (err) {
            setError('Failed to generate new meal suggestions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.email) {
            fetchUser();
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    Please sign in to view meal suggestions.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">AI-Generated Meal Plan</h2>
                <Button
                    onClick={requestNewMeal}
                    disabled={loading || !user}
                    className="flex items-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCcw className="w-4 h-4" />
                    )}
                    {loading ? "Generating..." : "Generate New Plan"}
                </Button>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meals.map((meal) => (
                    <Card key={meal.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-xl">{meal.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{meal.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Calories</span>
                                    <span className="font-semibold">{meal.calories}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Protein</span>
                                    <span className="font-semibold">{meal.protein}g</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Carbs</span>
                                    <span className="font-semibold">{meal.carbs}g</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Fat</span>
                                    <span className="font-semibold">{meal.fat}g</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Ingredients</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {meal.ingredients.map((ingredient, index) => (
                                            <li key={index} className="text-sm">{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold mb-2">Instructions</h4>
                                    <ol className="list-decimal list-inside space-y-1">
                                        {meal.instructions.map((instruction, index) => (
                                            <li key={index} className="text-sm">{instruction}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}