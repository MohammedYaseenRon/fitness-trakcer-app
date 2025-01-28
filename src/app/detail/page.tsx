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
    fitnessGoal: FitnessGoal;
    activityLevel: ActivityLevel;
    dailyCalories: number;
}

const UserDetailsForm = () => {
    const router = useRouter();


    const [formData, setFormData] = useState({
        weight: "",
        height: "",
        age: "",
        fitnessGoal: "MAINTAIN",
        activityLevel: "MODERATE",
        dailyCalories: 2000,
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

    const handleSelectChange = (name: "fitnessGoal" | "activityLevel", value: string) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateCurrentStep = () => {
        switch (step) {
            case 1:
                return formData.weight && formData.height && formData.age;
            case 2:
                return formData.fitnessGoal && formData.activityLevel;
            case 3:
                return formData.dailyCalories > 0;
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

                    if (response.status === 201) {
                        setFormData({
                            weight: "",
                            height: "",
                            age: "",
                            fitnessGoal: "MAINTAIN",
                            activityLevel: "MODERATE",
                            dailyCalories: 2000,
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
            <div className="flex items-center lg:w-[calc(100vw-600px)] xl:w-[calc(100vw-720px)] w-full px-16 py-8">
                <Card className="w-[600px] shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            {step === 1 && "Basic Information"}
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

            <div className="relative hidden lg:block w-[600px] xl:w-[720px]">
                <img
                    src="/api/placeholder/600/1080"
                    alt="sign up"
                    className="h-screen w-full object-cover"
                />
            </div>
        </div>
    );
};

export default UserDetailsForm;