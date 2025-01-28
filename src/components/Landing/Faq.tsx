"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Faq {
    question: string;
    answer: string
}


const FAQItems = ({ question, answer }: Faq) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-800">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}>
                <p className="px-4 text-gray-400">{answer}</p>
            </div>
        </div>
    )
}

const FAQ = () => {
    const faqs = [
        {
            question: "How do I get started with tracking my fitness journey?",
            answer: "Getting started is easy! Simply create your account, input your basic information (height, weight, fitness goals), and choose your preferred activities to track. Our dashboard will guide you through setting up your first fitness goals and tracking metrics."
        },
        {
            question: "Can I sync my fitness wearables with your platform?",
            answer: "Yes! Our platform integrates seamlessly with popular fitness devices including Apple Watch, Fitbit, Garmin, and other major brands. This allows automatic syncing of your heart rate, steps, workouts, and sleep data for comprehensive tracking."
        },
        {
            question: "What types of goals can I track?",
            answer: "You can track various fitness goals including weight loss, muscle gain, step count, workout frequency, running distances, personal records, and nutrition targets. Our platform allows you to set both short-term and long-term goals with milestone tracking."
        },
        {
            question: "How accurate is your nutrition tracking?",
            answer: "Our nutrition database includes over 1 million food items with detailed nutritional information. You can scan barcodes, create custom meals, and track macronutrients. We regularly update our database to ensure accuracy and comprehensiveness."
        },
        {
            question: "What kind of progress reports do you provide?",
            answer: "We provide detailed weekly and monthly progress reports that include workout summaries, nutrition analysis, body measurements, goal progression, and trend analysis. You can also generate custom reports focusing on specific metrics you're most interested in."
        },
        {
            question: "Is my fitness data secure and private?",
            answer: "Yes, we take data privacy seriously. All your fitness and personal data is encrypted and stored securely. You have full control over what data you share and can manage your privacy settings at any time through your account dashboard."
        },
        {
            question: "Can I connect with other users or join fitness challenges?",
            answer: "Absolutely! Our community features allow you to connect with like-minded fitness enthusiasts, join group challenges, share achievements, and participate in monthly fitness competitions. You can also create private groups with friends or workout partners."
        },
        {
            question: "What if I need help using the tracking features?",
            answer: "We offer comprehensive support including tutorial videos, a detailed help center, and responsive customer service. You can access our support team through live chat, email, or schedule a one-on-one guidance session for personalized assistance."
        },
        {
            question: "Can I customize my dashboard and tracking metrics?",
            answer: "Yes! Our platform is highly customizable. You can personalize your dashboard to display the metrics most important to you, create custom workout templates, set specific tracking parameters, and adjust your goals as your fitness journey progresses."
        },
        {
            question: "Do you offer a mobile app?",
            answer: "Yes, our mobile app is available for both iOS and Android devices. It syncs seamlessly with the web platform and offers full functionality for tracking your fitness on the go, including offline tracking capabilities."
        }
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="space-y-1 rounded-lg border border-gray-200">
                {faqs.map((faq, index) => (
                    <FAQItems
                        key={index}
                        question={faq.question}
                        answer={faq.answer}
                    />
                ))}
            </div>
        </div>
    );
};

export default FAQ;