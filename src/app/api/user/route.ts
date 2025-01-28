import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/lib/auth";

import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();


export async function POST(req: NextRequest, res: NextResponse) {

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    try {
        const { weight, height, age, fitnessGoal, activityLevel, dailyCalories } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                weight: parseFloat(weight),
                height: parseFloat(height),
                age: parseInt(age),
                fitnessGoal,
                activityLevel,
                dailyCalories: parseInt(dailyCalories),
            },
        });
        return NextResponse.json(
            {
                success: true,
                message: 'Content created successfully',
                data: updatedUser
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error updating user details:', error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

export async function GET(req:NextRequest) {
    try{
        const session = await getServerSession(authOptions);
        if(!session || !session.user?.email) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

        }
        const user = await prisma.user.findUnique({
            where:{
                email:session.user.email
            }
        });
        if(!user){
            return NextResponse.json({ message: 'User not found' }, { status: 404 });

        }
        return NextResponse.json(
            {
              success: true,
              message: 'Content fetched successfully',
              data: user
            },
            { status: 200 }
          );
    }catch(error) {
        console.error("Error while fetching user details:", error);
        return NextResponse.json({success:false,error:"Internal server error"},{status:500})
    }
}