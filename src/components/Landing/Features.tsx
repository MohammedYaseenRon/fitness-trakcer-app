"use client";
import React, { useRef, useEffect } from "react";

interface FeatureItem {
    id: number;
    title: string;
    content: string;
    date: string;
}

interface FeaturesProps {
    items: FeatureItem[];
}

export const Features: React.FC<FeaturesProps> = ({ items }) => {
    const timelineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-x-0');
                        entry.target.classList.remove('opacity-0', 'translate-x-[-50px]', 'translate-x-[50px]');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const featureItems = timelineRef.current?.querySelectorAll('.timeline-item');
        featureItems?.forEach((item) => observer.observe(item));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative max-w-6xl mx-auto py-10" ref={timelineRef}>
            {/* Center line */}
            <div className="absolute w-1 bg-blue-500 h-5/6 left-1/2 transform -translate-x-1/2"></div>

            {items.map((item, index) => (
                <div
                    key={item.id}
                    className={`timeline-item mb-8 flex justify-between items-center w-full ${
                        index % 2 === 0 ? 'flex-row-reverse' : ''
                    } opacity-0 transition-all duration-500 ease-in-out ${
                        index % 2 === 0 ? 'translate-x-[50px]' : 'translate-x-[-50px]'
                    }`}
                >
                    <div className="order-1 w-5/12"></div>
                    <div className="z-20 flex items-center order-1 bg-blue-500 shadow-xl w-8 h-8 rounded-full">
                        <h1 className="mx-auto font-semibold text-lg text-white">{index + 1}</h1>
                    </div>
                    <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
                        <h3 className="mb-3 font-bold text-gray-800 text-xl">{item.title}</h3>
                        <p className="text-sm leading-snug tracking-wide text-gray-600">{item.content}</p>
                        <p className="mt-2 text-xs text-gray-500">{item.date}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
