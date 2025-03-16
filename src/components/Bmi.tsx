import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface BMIGaugeProps {
  userData: {
    data: {
      user:{
        weight: number;
        height: number;
      }
    }
  } | null;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ userData }) => {
  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Determine BMI Category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  // If no user data, return null
  if (!userData) return null;

  
  const bmi = calculateBMI(userData.data.user.weight, userData.data.user.height);
  const { category, color } = getBMICategory(bmi);

  // Calculate rotation angle for the needle (180 degrees represents the full gauge)
  const calculateNeedleRotation = () => {
    // Map BMI to a rotation between 0 and 180 degrees
    // Assume BMI range from 10 to 40
    const minBMI = 10;
    const maxBMI = 40;
    const normalizedBMI = Math.min(Math.max(bmi, minBMI), maxBMI);
    const rotationPercentage = (normalizedBMI - minBMI) / (maxBMI - minBMI);
    return rotationPercentage * 180;
  };

  const needleRotation = calculateNeedleRotation();

  return (
    <Card className="w-full lg:max-w-full sm:max-x-sm">
      <CardHeader>
        <CardTitle>BMI Analysis</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-full lg:w-64 sm:w-32 h-32 ">
          {/* Gauge Background */}
          <div className="absolute inset-0 bg-gray-200 rounded-b-full overflow-hidden">
            {/* Color Zones */}
            <div className="absolute bottom-0 left-0 w-1/4 h-full bg-blue-300 opacity-50"></div>
            <div className="absolute bottom-0 left-1/4 w-1/2 h-full bg-green-300 opacity-50"></div>
            <div className="absolute bottom-0 right-1/4 w-1/4 h-full bg-orange-300 opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-1/4 h-full bg-red-300 opacity-50"></div>
          </div>

          {/* Needle */}
          <div
            className="absolute bottom-0 left-1/2 w-1 h-32 bg-black origin-bottom transform transition-transform duration-500"
            style={{
              transform: `translateX(-50%) rotate(-${90 - needleRotation}deg)`
            }}
          />
        </div>

        {/* BMI Details */}
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">
            BMI: <span className={color}>{bmi}</span>
          </p>
          <p className={`font-semibold ${color}`}>
            Category: {category}
          </p>
          <div className="text-sm text-gray-600 mt-2">
            {category === 'Underweight' &&
              "Consider consulting a nutritionist to develop a healthy weight gain plan."}
            {category === 'Normal weight' &&
              "Great job maintaining a healthy weight! Continue balanced diet and exercise."}
            {category === 'Overweight' &&
              "Focus on balanced nutrition and increased physical activity."}
            {category === 'Obese' &&
              "Consult healthcare professionals for a comprehensive health and weight management strategy."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMIGauge;