import { useMemo } from 'react';
import { Header } from './Header';
import { IoIosFitness } from "react-icons/io";
import { MdOutlineTimer } from "react-icons/md";
import { InfoCard } from '../cards/InfoCard';
import { About } from '@/components/helper/About';
import { Features } from './Features';
import FAQItems from './Faq';


export function Mainpage() {


    const infoCards = useMemo(() => [
        {
            label: "Achieve Your Fitness Goals with Precision Tracking",
            desc: "Track your workouts, monitor your progress, and stay motivated with our advanced fitness tracking app.",
            icon: IoIosFitness
        },
        {
            label: "Maximize Your Fitness with Smart Tracking and Insights",
            desc: " Our app provides detailed analytics on your workouts, including pace, distance, and heart rate, helping you fine-tune your training for optimal results.",
            icon: MdOutlineTimer
        },
        {
            label: "Transform Your Fitness Journey with Real-Time Tracking",
            desc: "Set personalized goals, track your progress, and stay motivated with features designed to support every step of your fitness journey. ",
            icon: MdOutlineTimer
        }
    ], []);

    const features = useMemo(() => [
        { id: 1, title: "Start Your Journey", content: "Sign up and create your profile", date: "Day 1" },
        { id: 2, title: "Set Your Goals", content: "Define your fitness objectives", date: "Week 1" },
        { id: 3, title: "Begin Workouts", content: "Start your personalized routine", date: "Week 2" },
        { id: 4, title: "Track Progress", content: "Log your activities and measurements", date: "Month 1" },
        { id: 5, title: "Milestone Achieved", content: "Celebrate your first big win!", date: "Month 1" },
    ], [])

    return (
        <div className="w-full">
            <Header />
            {/* All-In-One Solution Section */}
            <section className="px-4 py-24 sm:px-6 lg:px-8" id="Intro">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
                            All-In-One <span className="text-blue-600">Solution</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
                            Whether you're fine-tuning your training or setting personalized goals, our real-time tracking features support every step of your fitness journey, ensuring you stay on the path to success.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {infoCards.map((item, index) => (
                            <InfoCard data={item} key={index} />
                        ))}
                    </div>
                </div>
            </section>
            {/* What is Fitness Tracking */}
            <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
                            What is <span className="text-blue-600">FitLife</span>?
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
                            FitLife offers personalized workout plans, expert-guided exercises, and real-time progress tracking to help you achieve your goals.
                        </p>
                    </div>
                    <About />
                </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-16 text-center text-4xl font-bold tracking-tight text-gray-900">
                        Our <span className="text-blue-600">Features</span>
                    </h2>
                    <Features items={features} />
                </div>
            </section>


            {/* FAQ Section */}
            <section className="border-t border-gray-200 bg-white px-4 py-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-16 text-center text-4xl font-bold tracking-tight text-gray-900">
                        Frequently Asked <span className="text-blue-600">Questions</span>
                    </h2>
                    <FAQItems />
                </div>
            </section>
        </div>

    )
}