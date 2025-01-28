"use client";

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Activity, Clock, Dumbbell, User, Calendar, TrendingUp, UserIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Profile from '@/components/Profile';
import { useSession } from "next-auth/react";
import axios from 'axios';



interface UserData {
  data: {
    name: string;
    weight: number;
    height: number;
    age: number;
    dailyCalories: number;
    fitnessGoal: string;
    activityLevel: string;
  };
  success: boolean;
  message: string;
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
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = useSession();


  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("api/user");
          if (response.status == 200) {
            setUserData(response.data); // Set the fetched user data
          } else {
            console.error(response.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      fetchUserData();
    }
  }, [session])



  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const data = {
  //     name: formData.get('name') as string,
  //     weight: Number(formData.get('weight')),
  //     height: Number(formData.get('height')),
  //     age: Number(formData.get('age')),
  //     dailyCalories: Number(formData.get('dailyCalories')),
  //     fitnessGoal: formData.get('fitnessGoal') as string,
  //     activityLevel: formData.get('activityLevel') as string,
  //   };
  //   setUserData(data);
  //   setShowForm(false);
  // };

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

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 overflow-y-auto">
      <div className="w-full">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {session?.user?.name   || userData?.data.name}! 🎯</h1>
            <p className="text-gray-600">Let's check your progress today</p>
          </div>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="p-2 rounded-full hover:bg-gray-200"
          >
            <UserIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {showProfile && <Profile />}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Daily Calories"
            value={userData?.data.dailyCalories}
            unit="kcal"
            icon={<Activity className="h-4 w-4 text-blue-600" />}
            description="Daily caloric target"
          />
          <StatsCard
            title="Current Weight"
            value={userData?.data.weight}
            unit="kg"
            icon={<TrendingUp className="h-4 w-4 text-green-600" />}
            description="Last updated today"
          />
          <StatsCard
            title="Height"
            value={userData?.data.height}
            unit="cm"
            icon={<Dumbbell className="h-4 w-4 text-purple-600" />}
            description="Current height"
          />
          <StatsCard
            title="Age"
            value={userData?.data.age}
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

};

export default Dashboard;