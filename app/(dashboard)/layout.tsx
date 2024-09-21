

import React from 'react';
import { SideBar } from '@/components/SideBar';
import { MdOutlineFitnessCenter } from "react-icons/md";


export default function Layout({
    children,
}:{
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div className="flex">
            <div className="w-64 border-r border-slate min-h-screen bg-gray-100 pt-28">
                <div>
                    <SideBar href={"/dashboard"} icon={<HomeIcon />} title="DashBoard" />
                    <SideBar href={"/workout"} icon={<WorkoutIcon />} title="Workout" />
                    <SideBar href={"/nutrition"} icon={<NutritionIcon />} title="Nutrition" />
                    <SideBar href={"/fitness"} icon={<FitnessIcon />} title="Fitness" />
                    <SideBar href={"/diet"} icon={<DietIcon />} title="Diet" />
                </div>
            </div>
            {children}
        </div>
    )
}

//Icons used from react-icons
function HomeIcon() {
return <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
<path d="M3 9.6V20a2 2 0 002 2h14a2 2 0 002-2V9.6l-10-6z" fill="#4CAF50"/>
<path d="M9 21V12h6v9h-6z" fill="#8BC34A" />
</svg>

}

function WorkoutIcon() {
    return (
        <div className='mt-1'>
            <MdOutlineFitnessCenter />
        </div>
    )
}

function NutritionIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
    <path d="M12 3C9.24 3 7 5.24 7 8c0 1.36.54 2.58 1.41 3.54C7.54 13.39 6 15.6 6 18c0 2.76 2.24 5 5 5s5-2.24 5-5c0-2.4-1.54-4.61-3.41-5.46C15.46 10.58 16 9.36 16 8c0-2.76-2.24-5-5-5z"fill="#F44336"/>
    <path d="M10 22h4v2h-4z" fill="#E57373" />
    </svg>
}

function FitnessIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="26" height="26">
            <g id="boy_with_dumbbell">
            <circle cx="32" cy="16" r="8" fill="#f9c802" />
            <path d="M32 8c-4.418 0-8 3.582-8 8 0-4.418 3.582-8 8-8z" fill="#1a1a1a" />
            <rect x="26" y="24" width="12" height="16" fill="#38ae48" />
            <rect x="16" y="26" width="8" height="4" fill="#f9c802" />
            <rect x="12" y="24" width="6" height="8" fill="#1a1a1a" />
            <rect x="40" y="26" width="8" height="4" fill="#f9c802" />
            <rect x="46" y="24" width="6" height="8" fill="#1a1a1a" />
            <rect x="10" y="22" width="6" height="2" fill="#6e6e6e" />
            <rect x="48" y="22" width="6" height="2" fill="#6e6e6e" />
            <rect x="28" y="40" width="4" height="12" fill="#1a1a1a" />
            <rect x="36" y="40" width="4" height="12" fill="#1a1a1a" />
            <rect x="26" y="52" width="8" height="4" fill="#ff5757" />
        </g>
    </svg>
    )
}

function DietIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"><path d="M12 2C9.79 2 8 3.79 8 6c0 1.86 1.11 3.44 2.67 4.22l.33.13V19h2V10.35l.33-.13C14.89 9.44 16 7.86 16 6c0-2.21-1.79-4-4-4z" fill="#FF9800"/><path d="M4 22h16v2H4z" fill="#FFD54F"/></svg>
}