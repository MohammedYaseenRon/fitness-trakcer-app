"use client";

import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Activity, Clock, Dumbbell, User, Calendar, TrendingUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserData {
  name: string;
  weight: number;
  height: number;
  age: number;
  dailyCalories: number;
  fitnessGoal: string;
  activityLevel: string;
}

const mockProgressData = [
  { date: 'Week 1', weight: 75, calories: 2500, steps: 8000 },
  { date: 'Week 2', weight: 74.5, calories: 2400, steps: 8500 },
  { date: 'Week 3', weight: 73.8, calories: 2350, steps: 9000 },
  { date: 'Week 4', weight: 73.2, calories: 2300, steps: 9500 },
];

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      weight: Number(formData.get('weight')),
      height: Number(formData.get('height')),
      age: Number(formData.get('age')),
      dailyCalories: Number(formData.get('dailyCalories')),
      fitnessGoal: formData.get('fitnessGoal') as string,
      activityLevel: formData.get('activityLevel') as string,
    };
    setUserData(data);
    setShowForm(false);
  };

  const StatsCard = ({ title, value, unit, icon, description }: any) => (
    <Card className="hover:shadow-lg transition-shadow w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  const content = showForm ? (
    <div className="w-full min-h-screen bg-gray-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Welcome to FitTrack</CardTitle>
          <CardDescription className="text-center">Let's get started with your fitness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  name="name"
                  type="text"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <input
                  name="age"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Weight (kg)</label>
                <input
                  name="weight"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Height (cm)</label>
                <input
                  name="height"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Calories Target</label>
                <input
                  name="dailyCalories"
                  type="number"
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fitness Goal</label>
                <select name="fitnessGoal" className="w-full p-2 border rounded-md" required>
                  <option value="weight-loss">Weight Loss</option>
                  <option value="muscle-gain">Muscle Gain</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Your Journey
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="w-full min-h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {userData?.name}! 🎯</h1>
          <p className="text-gray-600">Let's check your progress today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Daily Calories"
            value={userData?.dailyCalories}
            unit="kcal"
            icon={<Activity className="h-4 w-4 text-blue-600" />}
            description="Daily caloric target"
          />
          <StatsCard
            title="Current Weight"
            value={userData?.weight}
            unit="kg"
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            description="Last updated today"
          />
          <StatsCard
            title="Fitness Goal"
            value={userData?.fitnessGoal?.replace('-', ' ')}
            icon={<Dumbbell className="h-4 w-4 text-purple-600" />}
            description="Current objective"
          />
          <StatsCard
            title="Age"
            value={userData?.age}
            unit="years"
            icon={<User className="h-4 w-4 text-orange-600" />}
            description="Profile information"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Weight Progress</CardTitle>
              <CardDescription>Last 4 weeks tracking</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Daily Activity</CardTitle>
              <CardDescription>Steps and calories burned</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#16a34a" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#dc2626" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return content;
};

export default Dashboard;