import { useMemo } from 'react';
import {Header} from './Header';
import {IoIosFitness}  from "react-icons/io";
import {MdOutlineTimer} from "react-icons/md";
import { InfoCard } from '../cards/InfoCard';


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
        </>
        
    )
}