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
import BMIGauge from '@/components/Bmi';



interface UserData {
  data: {
    user: {
      name: string;
      weight: number;
      height: number;
      age: number;
      dailyCalories: number;
      fitnessGoal: string;
      activityLevel: string;
    };
    workoutPlan: {
      day: string;
      name: string;
      exercises: {
        name: string;
        sets: number;
        reps: number;
        rest: number;
        duration:number
      }[];
      quote: string;
    }[];
  }

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
  const { data: session } = useSession();


  useEffect(() => {
    if (session?.user?.email) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("api/user");
          if (response.status == 200) {
            console.log(response);
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
        <div className="mb-8 flex justify-between items-center border-b w-full">
          <div className='mb-2'>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {session?.user?.name || userData?.data.user.name}</h1>
            <p className="text-gray-600">Let's check your progress today</p>
          </div>
        </div>

        {/* Stats Grid */}
        {userData?.data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Daily Calories"
              value={userData?.data.user.dailyCalories}
              unit="kcal"
              icon={<Activity className="h-4 w-4 text-blue-600" />}
              description="Daily caloric target"
            />
            <StatsCard
              title="Current Weight"
              value={userData?.data.user.weight}
              unit="kg"
              icon={<TrendingUp className="h-4 w-4 text-green-600" />}
              description="Last updated today"
            />
            <StatsCard
              title="Height"
              value={userData?.data.user.height}
              unit="cm"
              icon={<Dumbbell className="h-4 w-4 text-purple-600" />}
              description="Current height"
            />
            <StatsCard
              title="Age"
              value={userData?.data.user.age}
              unit="years"
              icon={<User className="h-4 w-4 text-orange-600" />}
              description="Profile information"
            />
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        {/* Charts Section */}
        <div>
          <BMIGauge userData={userData} />
        </div>
        <div className='mt-4'>
          <Card className="w-full lg:max-w-full sm:max-x-sm">
            <CardHeader>
              <CardTitle>Workout Plan for 7 days Follow To get better each day</CardTitle>
            </CardHeader>
            <CardContent>
              {userData?.data?.workoutPlan && Array.isArray(userData.data.workoutPlan) && userData.data.workoutPlan.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userData.data.workoutPlan.map((workoutDay, index) => (
                    <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                          {workoutDay.day}: {workoutDay.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Array.isArray(workoutDay.exercises) && workoutDay.exercises.length > 0 ? (
                          <ul className="list-disc pl-5 mb-4 text-gray-700">
                            {workoutDay.exercises.map((exercise, i) => (
                              <li key={i}>
                                {exercise.duration   
                                ? `${exercise.name}: ${exercise.duration} mintutes`
                                :`${exercise.name}: ${exercise.sets} sets, ${exercise.reps} reps, ${exercise.rest}s rest`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-600 italic mb-4">Rest Day - Relax and recharge!</p>
                        )}
                        <blockquote className="text-sm text-gray-500 italic border-l-4 border-blue-500 pl-2">
                          "{workoutDay.quote}"
                        </blockquote>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No workout plan available. Please ensure your profile is complete.</p>
              )}
            </CardContent>



          </Card>
        </div>
      </div>
    </div>
  );

};

export default Dashboard;