import React from 'react';
import { Layout } from '@/components/Layout';
import { WelcomeCard } from '@/components/WelcomeCard';
import { StatsCard } from '@/components/StatsCard';
import { Activity, Clock, Dumbbell, User } from 'lucide-react'
import { UserProfile } from '@/components/UserProfile';
import Graph from '@/components/Graph';
import Schedule from '@/components/Schedule';


interface UserData {
    name: string;
    weight: number;
    height: number;
    age: number;
    dailyCalories: number;
}

// Create a user object to hold actual data
const user: UserData = {
    name: "John Doe",
    weight: 75,
    height: 175,
    age: 30,
    dailyCalories: 2500,
};

const userInfo = {
    name: "John Doe",
    location: "California, USA",
    weight: 56,
    height: 5.7,
    age: 31,
    image: "https://via.placeholder.com/150",
}


export default function Dashboard() {
    return (
        <Layout>
            <div className="flex ">
                {/* Left Side: Welcome Card and Stats Cards */}
                <div className="flex-1 mr-4">
                    <div className="mb-6">
                        <WelcomeCard name={user.name} />
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <div className="grid grid-cols-3 gap-6 mb-6">
                            <StatsCard 
                                title="Calories" 
                                value={user.dailyCalories} 
                                unit="kcal" 
                                icon={<Activity className="text-blue-500" />} 
                            />
                            <StatsCard 
                                title="Walk Rate" 
                                value={user.weight} 
                                unit="steps" 
                                icon={<Clock className="text-green-500" />} 
                            />
                            <StatsCard 
                                title="Fitness Score" 
                                value={user.height} 
                                unit="%" 
                                icon={<Dumbbell className="text-purple-500" />} 
                            />
                            <div>
                                <Graph />
                            </div>
                        </div> 
                    </div>
                </div>
                {/* Right Side: User Profile Section */}
                <div className="w-96 px-12 py-4 bg-white rounded-lg shadow-md">
                    <UserProfile userInfo={userInfo} />
                    <div className='py-12'>
                        <Schedule />
                    </div>
                </div>
                
            </div>
        </Layout>
    );
}