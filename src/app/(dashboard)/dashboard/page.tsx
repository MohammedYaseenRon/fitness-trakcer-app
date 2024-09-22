import React from 'react';
import { Layout } from '@/src/components/Layout';
import { WelcomeCard } from '@/src/components/WelcomeCard';
import { StatsCard } from '@/src/components/StatsCard';
import { Activity, Clock, Dumbbell } from 'lucide-react'


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

const DashBoard: React.FC = () => {
    return (
        <Layout>
            <WelcomeCard name={user.name}/>
            <div className='grid grid-cols-3 gap-6 mt-6'>
                <StatsCard title="Calories" value={user.dailyCalories} unit="kcal" icon={<Activity />}/>
                <StatsCard title="Weight" value={user.weight} unit="kg" icon={<Clock />}/>
                <StatsCard title="Heighht" value={user.height} unit="cm" icon={<Dumbbell />}/>
            </div>

        </Layout>
    )
}
export default DashBoard