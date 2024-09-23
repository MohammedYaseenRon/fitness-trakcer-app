"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const contentArray = [
    {
        id: 1,
        image: "/Assets/health.png",
        text: "Progress Visualization.",
        desc: "Fit 4 You tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 2,
        image: "/Assets/nutrion.png",
        text: "Nutrition Tracking.",
        desc: "Our Nutrition Tracking feature is designed to help you take control of your diet and achieve your health objectives. Whether you’re aiming to lose weight, gain muscle, or simply maintain a balanced diet, our intuitive tracking system makes it easy to log your daily meals and monitor your nutrient intake.."
    },
    {
        id: 3,
        image: "/Assets/health.png",
        text: "Weekely Challenges.",
        desc: "Our Weekly Challenges feature is designed to motivate and inspire you to push your limits and achieve your fitness goals. Each week, you’ll have the opportunity to participate in exciting challenges that not only enhance your physical capabilities but also foster a sense of community and friendly competition."
    },
    {
        id: 4,
        image: "/Assets/health.png",
        text: "Health Cure",
        desc: "Our AI-Powered Health Tracking feature is designed to provide you with personalized insights and recommendations, helping you take control of your health like never before. By harnessing the power of artificial intelligence, we transform your health data into actionable strategies tailored specifically for you."
    },
    {
        id: 5,
        image: "/Assets/one.png",
        text: "Personal Remainder.",
        desc: "Fit4You provides you to  create, manage, and receive reminders in real-time, ensuring you never miss an important task or event with real-time notification Remainder"
    },
    {  
        id: 6,
        image: "/Assets/health.png",
        text: "Goal Setting.",
        desc: "Fit4You helps to set, track, and accomplish your goals effectively while keeping yourself motivated along the way.."
    },
    {
        id: 7,
        image: "/Assets/one.png",
        text: " Ont to One Montioring.",
        desc: "Our One-to-One Mentoring Sessions leverage WebSocket technology to provide real-time, interactive communication between mentors and mentees. Enjoy personalized guidance and instant feedback in a secure environment, ensuring a rich and engaging learning experience."
    },
];

export const ServiceInfo = () => {
    return (
        <div className="grid grid-cols-1 gap-8">
            {contentArray.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                    <div className={`p-4 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                        <p className="text-blue-500 tracking-wide text-3xl font-frank mb-1">
                            {item.id}. {item.text}
                        </p>
                        <p className="text-gray-500 font-medium text-xl font-frank leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                    <div className={`p-4 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                        <motion.div
                            initial={{ x: index % 2 === 0 ? 100 : -100, opacity: 0 }} 
                            animate={{ x: 0, opacity: 1 }} 
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                src={item.image}
                                alt={`Image for section ${item.id}`}
                                width={400}
                                height={200}
                                className="rounded-lg"
                            />
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    );
};