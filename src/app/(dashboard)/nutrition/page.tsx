import MealSuggestions from "@/components/MealSuggestions";
import NutritionTracker from "@/components/NutritionTrack";

export default function Dashboard() {
    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Nutrition and Meal Suggestion</h1>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Nutrition Tracker */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-1">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Nutrition Tracker</h2>
                    <NutritionTracker />
                </div>

                {/* Meal Suggestions */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Meal Suggestions</h2>
                    <MealSuggestions />
                </div>
            </div>

        </div>
    );
}
