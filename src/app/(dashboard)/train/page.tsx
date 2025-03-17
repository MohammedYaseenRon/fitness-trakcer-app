import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'

const trainData = [
  {
    id: "pushup",
    title: "Push Up",
    image: "/Assets/pushpng.png",
    description: "A push-up is a bodyweight exercise primarily targeting the chest, shoulders, and triceps, while also engaging the core and lower body for stability."
  },
  {
    id: "squats",
    title: "Squats",
    image: "/Assets/squat.png",
    description: "A squat is a fundamental lower-body exercise that targets the quadriceps, hamstrings, glutes, and core. It also helps improve balance, flexibility, and strength."
  }, 
  {
    id: "crunches",
    title: "Crunches",
    image: "/Assets/crunches1.png",
    description: "Crunches are a classic abdominal exercise that primarily targets the rectus abdominis and helps build core strength."
  }, 
  {
    id: "bicep",
    title: "Bicep Curl",
    image: "/Assets/curl.png",
    description: "A bicep curl is a popular exercise that targets the biceps brachii (the muscles at the front of the upper arm) to build strength and muscle mass."
  }
]

const Page = () => {
  return (
    <div className='space-y-8 px-6 py-10'>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-black">Train accruately with Tracking System</h1>
      </div>

      {/* Card Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center'>
        {trainData.map((item) => (
          <Link key={item.id} href={`/train/${item.id}`} passHref>
            <Card className='w-full md:w-80 rounded-2xl cursor-pointer shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300'>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-2xl"
                />
              </div>
              <CardHeader>
                <CardTitle className='text-xl text-red-700 font-medium text-center'>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className='font-medium text-gray-600 text-center'>
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Page;
