import React from 'react';
import Image from 'next/image';

// ServiceInfo Component
export const ServiceInfo = () => {
  const contentArray = [
    {
      id: 1,
      image: "/Assets/health.png",
      text: "Progress Visualization",
      desc: "Fit 4 You tracking system is designed to empower users in their health and wellness journey. With features such as real-time activity monitoring, personalized workout plans, and dietary guidance, it provides a comprehensive approach to fitness."
    },
    {
      id: 2,
      image: "/Assets/nutrion.png",
      text: "Nutrition Tracking",
      desc: "Our Nutrition Tracking feature is designed to help you take control of your diet and achieve your health objectives. Whether you're aiming to lose weight, gain muscle, or simply maintain a balanced diet, our intuitive tracking system makes it easy to log your daily meals and monitor your nutrient intake."
    },
    {
      id: 3,
      image: "/Assets/health.png",
      text: "Create your workout Plan",
      desc: "Our workout plan feature is designed to motivate and inspire you to push your limits and achieve your fitness goals. Each week, you'll have the opportunity to participate in exciting challenges that not only enhance your physical capabilities but also foster a sense of community and friendly competition."
    },
    {
      id: 4,
      image: "/Assets/health.png",
      text: "Health Cure",
      desc: "Our AI-Powered Health Tracking feature is designed to provide you with personalized insights and recommendations, helping you take control of your health like never before. By harnessing the power of artificial intelligence, we transform your health data into actionable strategies tailored specifically for you."
    },
    {
      id: 5,
      image: "/Assets/health.png",
      text: "Goal Setting",
      desc: "Fit4You helps to set, track, and accomplish your goals effectively while keeping yourself motivated along the way."
    },
    {
      id: 6,
      image: "/Assets/one.png",
      text: "One to One Monitoring",
      desc: "Our One-to-One Mentoring Sessions leverage WebSocket technology to provide real-time, interactive communication between mentors and mentees. Enjoy personalized guidance and instant feedback in a secure environment, ensuring a rich and engaging learning experience."
    },
  ];

  return (
    <div className="grid gap-16">
      {contentArray.map((item, index) => (
        <div
          key={item.id}
          className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className={`space-y-4 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  {item.id}
                </span>
                <h3 className="text-2xl font-bold text-gray-900">
                  {item.text}
                </h3>
              </div>
              <p className="text-lg leading-relaxed text-gray-600">
                {item.desc}
              </p>
            </div>
            <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <Image
                  src={item.image}
                  alt={`${item.text} illustration`}
                  width={400}
                  height={300}
                  className="transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};