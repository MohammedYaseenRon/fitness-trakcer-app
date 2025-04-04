import React from "react";
import Image from "next/image";
import Link from "next/link";


export const Header: React.FC = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-blue-600">
      <div className="container mx-auto px-4 py-8 md:px-8 lg:px-12 xl:px-18 2xl:px-24">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:gap-16 xl:gap-24">
          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl font-frank leading-tight text-white md:text-5xl lg:text-6xl">
              Set <span className="text-amber-200">Goals </span>
              and Achieve{" "}
              <span className="text-amber-200">Milestones</span>
            </h1>

            <p className="font-frank text-lg leading-relaxed text-white md:text-xl">
              Set achievable fitness goals and track your milestones with ease.
              Our app allows you to create custom fitness plans, set targets,
              and monitor your progress over time. Celebrate your achievements
              and stay on track with reminders and motivational prompts designed
              to keep you focused and engaged.
            </p>

            <div className="pt-4">
              <Link href="/signup"><button
                type="button"
                className="rounded-lg bg-white px-6 py-3 font-frank text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Get Started
              </button></Link>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1">
            <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
              <Image
                src="/Assets/fitness.png"
                alt="Fitness"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
