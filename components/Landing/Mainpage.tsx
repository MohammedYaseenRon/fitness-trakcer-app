import { useMemo } from 'react';
import {Header} from './Header';
import {IoIosFitness}  from "react-icons/io";
import {MdOutlineTimer} from "react-icons/md";
import { InfoCard } from '../cards/InfoCard';
import { About } from '../helper/About';
import { Features } from './Features';


export function Mainpage() {


    const inforCards = useMemo(() => [
        {
            label:"Achieve Your Fitness Goals with Precision Tracking",
            desc:"Track your workouts, monitor your progress, and stay motivated with our advanced fitness tracking app.",
            icon: IoIosFitness 
        },
        {
            label:"Maximize Your Fitness with Smart Tracking and Insights",
            desc:" Our app provides detailed analytics on your workouts, including pace, distance, and heart rate, helping you fine-tune your training for optimal results.",
            icon: MdOutlineTimer
        },
        {
            label:"Transform Your Fitness Journey with Real-Time Tracking",
            desc:"Set personalized goals, track your progress, and stay motivated with features designed to support every step of your fitness journey. ",
            icon: MdOutlineTimer
        }
    ],[]);
    
    const features = useMemo(() => [
        { id: 1, title: "Start Your Journey", content: "Sign up and create your profile", date: "Day 1" },
        { id: 2, title: "Set Your Goals", content: "Define your fitness objectives", date: "Week 1" },
        { id: 3, title: "Begin Workouts", content: "Start your personalized routine", date: "Week 2" },
        { id: 4, title: "Track Progress", content: "Log your activities and measurements", date: "Month 1" },
        { id: 5, title: "Milestone Achieved", content: "Celebrate your first big win!", date: "Month 3" },
    ],[]) 

    return (
        <>
        <div>
          <Header />
        </div>
        <div className="max-w-[80%] m-auto">
            <div className="py-20 overflow-hidden" id="Intro">
                <div className="lg:px-48">
                    <p className="font-semibold text-3xl text-center">All-In-One <span className="text-blue-500">Solution</span></p>
                    <p className="text-lg text-gray-500 py-4 text-center">Whether you're fine-tuning your training or setting personalized goals, our real-time tracking features support every step of your fitness journey, ensuring you stay on the path to success.</p>
                </div>
                <div className="grid md:grid-cols-3 lg:flex-row gap-8">
                    {inforCards.map((item,index)=>{
                        return  <InfoCard data={item} key={index} />;
                    })}
                </div>
            </div>

        </div>

        {/* What is Fitness Tracking */}
        <div className="py-20">
            <div className="lg:px-44">
                <p className="text-3xl font-semibold text-center ">
                    What is <span className="text-blue-500">FitLife</span> ?   
                </p>
                <p className="py-6 text-lg text-gray-500 text-center">FitLife offers personalized workout plans, expert-guided exercises, and real-time progress tracking to help you achieve your goals.</p>
            </div>
            <About />
            
        </div>

        {/* Features */}
        <div className="py-8 px-4 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-10">Our Features</h1>
            <Features items={features} />
        </div>
        </>
        
    )
}