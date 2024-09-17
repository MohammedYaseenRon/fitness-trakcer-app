import React from "react";
import Image from "next/image";


export const Header: React.FC = () => {
  return (
    <div className="lg:h-screen overflow-x-hidden bg-blue-600">
      <div className="py-10 px-12 lg:px-32 lg:py-20 flex flex-col lg:flex-row gap-16 items-center justify-center">
        <div className="grid gap-4 flex-1">
          <h1 className="text-4xl font-lg font-frank text-white leading-9">
            Set <span className="text-amber-200">Goals </span>and Achieve <span className="text-amber-200">Milestones</span>
          </h1>
          <p className="text-gray-400 font-frank leading-9">
            Set achievable fitness goals and track your milestones with ease. Our app allows you to create custom fitness plans, set targets, and monitor your progress over time. Celebrate your achievements and stay on track with reminders and motivational prompts designed to keep you focused and engaged.
          </p>
          <div className="leading-9">
            <button
              type="button"
              className="py-2.5 px-5 me-2 mb-2 font-frank text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100"
            >
              Get Started
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div style={{ position: 'relative', width: '500px', height: '400px' }}>
            <Image
              src="/Assets/fitness.png"
              alt="Fitness"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
