"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type FitnessGoal = "LOSE" | "GAIN" | "MAINTAIN";
type ActivityLevel = "SEDENTARY" | "LIGHT" | "MODERATE" | "ACTIVE";

interface Details {
    weight: string;
    height: string;
    age: string;
    gender:string,
    fitnessGoal: FitnessGoal;
    activityLevel: ActivityLevel;
    dailyCalories: number;
    dietaryPreferences: string[],
    allergies: string[]
    weightGoal: string
    numberOfMeals: number | null;
    workoutDaysPerWeek:number,
    workoutDuration:number,
    workoutLocation:string,
    availableEquipment:string[]
}

const UserDetailsForm = () => {
    const router = useRouter();


    const [formData, setFormData] = useState<Details>({
        weight: "",
        height: "",
        age: "",
        gender:"",
        workoutDaysPerWeek:4,
        workoutDuration:30,
        workoutLocation:"Home",  
        availableEquipment:[] as string[],
        fitnessGoal: "MAINTAIN",
        activityLevel: "MODERATE",
        dailyCalories: 2000,
        dietaryPreferences: [] as string[],
        allergies: [] as string[],
        weightGoal: "",
        numberOfMeals: null as number | null

    });

    const [step, setStep] = useState(1);
    const totalSteps = 3;
    const progress = (step / totalSteps) * 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSelectChange = (name: "fitnessGoal" | "activityLevel" | "gender" | "workoutLocation", value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const validateCurrentStep = () => {
        switch (step) {
            case 1:
                return formData.weight && formData.height && formData.gender &&  formData.age && formData.weightGoal;
            case 2:
                return formData.fitnessGoal && formData.activityLevel && formData.numberOfMeals !== null && formData.dietaryPreferences && formData.workoutDaysPerWeek;
            case 3:
                return formData.dailyCalories > 0 && formData.allergies.length >= 0 && formData.workoutDuration >=0 && formData.workoutLocation && formData.availableEquipment
            default:
                return false;
        }
    };

    const handleNext = async () => {
        if (validateCurrentStep()) {
            if (step === totalSteps) {
                try {
                    const response = await axios.post("/api/user", {
                        ...formData,
                    });
                    console.log(response.data);
                    if (response.status === 201) {
                        setFormData({
                            weight: "",
                            height: "",
                            age: "",
                            gender:"",
                            workoutDaysPerWeek:4,
                            workoutDuration:30,
                            workoutLocation:"",
                            availableEquipment:[],
                            fitnessGoal: "MAINTAIN",
                            activityLevel: "MODERATE",
                            dailyCalories: 2000,
                            dietaryPreferences: [],
                            allergies: [],
                            weightGoal: "",
                            numberOfMeals: null


                        });
                        toast.success("User details updated successfully!");
                        router.push("/dashboard");

                    }
                } catch (error) {
                    console.error("Error submitting form", error);
                    toast.error("An error occurred while submitting the form. Please try again.");
                }
            } else {
                setStep(step + 1);
            }
        } else {
            toast.error("Please fill in all required fields");
        }
    };

    const handlePrevious = () => setStep(step - 1);

    return (
        <div className="min-h-screen w-full flex">
            <div className="flex items-center lg:w-[calc(100vw-600px)] xl:w-[calc(100vw-720px)] w-full px-24 py-8 bg-amber-50
">
                <Card className="w-[600px]">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            {step === 1 && "Basic Information of Your's"}
                            {step === 2 && "Fitness Profile"}
                            {step === 3 && "Daily Goals"}
                        </CardTitle>
                        <Progress value={progress} className="w-full h-2 mt-4" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="weight" className="text-sm font-medium">
                                                Weight (kg)
                                            </Label>
                                            <Input
                                                id="weight"
                                                name="weight"
                                                type="number"
                                                placeholder="Enter your weight"
                                                className="h-11"
                                                value={formData.weight}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="height" className="text-sm font-medium">
                                                Height (cm)
                                            </Label>
                                            <Input
                                                id="height"
                                                name="height"
                                                type="number"
                                                placeholder="Enter your height"
                                                className="h-11"
                                                value={formData.height}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="text-sm font-medium">
                                            Age
                                        </Label>
                                        <Input
                                            id="age"
                                            name="age"
                                            type="number"
                                            placeholder="Enter your age"
                                            className="h-11"
                                            value={formData.age}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender" className="text-sm font-medium">
                                            Gender
                                        </Label>
                                        <Select
                                            value={formData.gender}
                                            onValueChange={(value) => handleSelectChange("gender", value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select your Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOSE">Male</SelectItem>
                                                <SelectItem value="GAIN">Female</SelectItem>
                                                {/* <SelectItem value="MAINTAIN">Maintain Weight</SelectItem> */}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weightGoal" className="text-sm font-medium">
                                            Target Weight (kg)
                                        </Label>
                                        <Input
                                            id="weightGoal"
                                            name="weightGoal"
                                            type="number"
                                            placeholder="Enter your target weight"
                                            className="h-11"
                                            value={formData.weightGoal}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="fitnessGoal" className="text-sm font-medium">
                                            Fitness Goal
                                        </Label>
                                        <Select
                                            value={formData.fitnessGoal}
                                            onValueChange={(value) => handleSelectChange("fitnessGoal", value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select your fitness goal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOSE">Lose Weight</SelectItem>
                                                <SelectItem value="GAIN">Gain Muscle</SelectItem>
                                                <SelectItem value="MAINTAIN">Maintain Weight</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="activityLevel" className="text-sm font-medium">
                                            Activity Level
                                        </Label>
                                        <Select
                                            value={formData.activityLevel}
                                            onValueChange={(value) => handleSelectChange("activityLevel", value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select your activity level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="SEDENTARY">Sedentary</SelectItem>
                                                <SelectItem value="LIGHT">Lightly Active</SelectItem>
                                                <SelectItem value="MODERATE">Moderately Active</SelectItem>
                                                <SelectItem value="ACTIVE">Very Active</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="numberOfMeals" className="text-sm font-medium">
                                            Preferred Number of Meals per Day
                                        </Label>
                                        <Input
                                            id="numberOfMeals"
                                            name="numberOfMeals"
                                            type="number"
                                            placeholder="Enter number of meals"
                                            className="h-11"
                                            value={formData.numberOfMeals || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="numberOfMeals" className="text-sm font-medium">
                                            Workout Days PerWeek
                                        </Label>
                                        <Input
                                            id="workoutDaysPerWeek"
                                            name="workoutDaysPerWeek"
                                            type="number"
                                            placeholder="Enter number workoutDaysPerWeek"
                                            className="h-11"
                                            value={formData.workoutDaysPerWeek}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dietaryPreferences" className="text-sm font-medium">
                                            Dietary Preferences
                                        </Label>
                                        <Input
                                            id="dietaryPreferences"
                                            name="dietaryPreferences"
                                            placeholder="Enter preferences (comma-separated)"
                                            className="h-11"
                                            value={formData.dietaryPreferences.join(', ')}
                                            onChange={(e) => {
                                                const preferences = e.target.value
                                                    .split(',')
                                                    .map(pref => pref.trim())
                                                    .filter(pref => pref !== '');
                                                setFormData({
                                                    ...formData,
                                                    dietaryPreferences: preferences
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="dailyCalories" className="text-sm font-medium">
                                            Daily Calorie Target
                                        </Label>
                                        <Input
                                            id="dailyCalories"
                                            name="dailyCalories"
                                            type="number"
                                            placeholder="Enter your daily calorie target"
                                            className="h-11"
                                            value={formData.dailyCalories}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dailyCalories" className="text-sm font-medium">
                                           Workout Duration
                                        </Label>
                                        <Input
                                            id="workoutDuration"
                                            name="workoutDuration"
                                            type="number"
                                            placeholder="Enter your workout duration of daily"
                                            className="h-11"
                                            value={formData.workoutDuration}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="workoutLocation" className="text-sm font-medium">
                                            Workout Location
                                        </Label>
                                        <Select
                                            value={formData.workoutLocation}
                                            onValueChange={(value) => handleSelectChange("workoutLocation", value)}
                                        >
                                            <SelectTrigger className="h-11">
                                                <SelectValue placeholder="Select your Location of the workout" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="HOME">Home</SelectItem>
                                                <SelectItem value="GYM">Gym</SelectItem>
                                                <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="availableEquipment" className="text-sm font-medium">
                                           Available Equipments
                                        </Label>
                                        <Input
                                            id="availableEquipment"
                                            name="availableEquipment"
                                            placeholder="Enter your available Equipments"
                                            className="h-11"
                                            value={formData.availableEquipment.join(', ')}
                                            onChange={(e) => {
                                                const equipment = e.target.value
                                                    .split(',')
                                                    .map(equipment => equipment.trim())
                                                    .filter(equipment => equipment !== '');
                                                setFormData({
                                                    ...formData,
                                                    availableEquipment: equipment
                                                });
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="allergies" className="text-sm font-medium">
                                            Food Allergies
                                        </Label>
                                        <Input
                                            id="allergies"
                                            name="allergies"
                                            placeholder="Enter allergies (comma-separated)"
                                            className="h-11"
                                            value={formData.allergies.join(', ')}
                                            onChange={(e) => {
                                                const allergiesList = e.target.value
                                                    .split(',')
                                                    .map(allergy => allergy.trim())
                                                    .filter(allergy => allergy !== '');
                                                setFormData({
                                                    ...formData,
                                                    allergies: allergiesList
                                                });
                                            }}
                                        />
                                    </div>

                                </div>
                            )}

                            <div className="flex justify-between pt-6">
                                {step > 1 && (
                                    <Button
                                        type="button"
                                        onClick={handlePrevious}
                                        variant="outline"
                                        className="w-28"
                                    >
                                        Previous
                                    </Button>
                                )}
                                {step === 1 && <div className="w-28" />}
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="w-28"
                                >
                                    {step === totalSteps ? "Submit" : "Next"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="relative hidden lg:block w-[700px] xl:w-[900px]">
                <img
                    src="Assets/healthImage.png"
                    alt="sign up"
                    className="h-screen w-full object-cover"
                />
            </div>
        </div>
    );
};

export default UserDetailsForm;