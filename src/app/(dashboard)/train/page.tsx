import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const trainData = [
  {
    id: "pushup",
    title: "Push Up",
    image: "/Assets/looseweight.png",
    description: "A push-up is a bodyweight exercise primarily targeting the chest, shoulders, and triceps, while also engaging the core and lower body for stability"
  },
  {
    id: "squats",
    title: "Squats",
    image: "/Assets/looseweight.png",
    description: "A squat is a fundamental lower-body exercise that targets the quadriceps, hamstrings, glutes, and core. It also helps improve balance, flexibility, and strength."
  }, {
    id: "crunches",
    title: "Crunches",
    image: "/Assets/looseweight.png",
    description: "Crunches are a classic abdominal exercise that primarily targets the rectus abdominis  and helps build core strength."
  }, {
    id: "bicep",
    title: "Bicep curl",
    image: "/Assets/looseweight.png",
    description: "A bicep curl is a popular exercise that targets the biceps brachii (the muscles at the front of the upper arm) to build strength and muscle mass."
  }
]

const page = () => {
  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className="ml-16 mt-6">
        <h1 className="text-2xl font-medium text-black">Nutrition and Meal Suggestion</h1>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 p-16 gap-4'>
        {trainData.map((item) => (
          <Link key={item.id} href={`/train/${item.id}`} passHref>
            <Card  className='w-72 h-auto rounded-xl cursor-pointer p-4 shadow-lg overflow-hidden border border-gray-200'>
              <Image
                src={item.image}
                alt={item.title}
                width={1000}
                height={200}
                className="w-full object-cover"
              />
              <CardHeader>
                <CardTitle className='text-xl text-red-700 font-medium text-center'>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='font-medium'>{item.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default page