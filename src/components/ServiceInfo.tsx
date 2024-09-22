"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const contentArray = [
    {
        id: 1,
        image: "/Assets/nutrion.png",
        text: "Progress Visualization.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 2,
        image: "/Assets/health.png",
        text: "Nutrition Tracking.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 3,
        image: "/Assets/nutrion.png",
        text: "Weekely Challenges.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 4,
        image: "/Assets/health.png",
        text: "Workout Tracking.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 5,
        image: "/Assets/nutrion.png",
        text: "Personal Remainder.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {  
        id: 6,
        image: "/Assets/health.png",
        text: "Goal Setting.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
        id: 7,
        image: "/Assets/health.png",
        text: " Ont to One Montioring.",
        desc: "FitLife tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
];

export const ServiceInfo = () => {
    return (
        <div className="grid grid-cols-1 gap-8">
            {contentArray.map((item, index) => (
                <div key={item.id} className="grid grid-cols-1 gap-8 md:grid-cols-2 items-center">
                    {/* Left side content for odd index and right side content for even index */}
                    <div className={`p-4 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                        <p className="text-blue-500 tracking-wide text-3xl font-frank mb-1">
                            {item.id}. {item.text}
                        </p>
                        <p className="text-gray-500 font-medium text-xl font-frank leading-relaxed">
                            {item.desc}
                        </p>
                    </div>

                    {/* Right side image for odd index and left side image for even index */}
                    <div className={`p-4 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                        <motion.div
                            initial={{ x: index % 2 === 0 ? 100 : -100, opacity: 0 }} // Start from right or left
                            animate={{ x: 0, opacity: 1 }} // Animate to center
                            transition={{ duration: 0.5 }} // Duration of animation
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