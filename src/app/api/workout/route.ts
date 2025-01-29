import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const prisma = new PrismaClient();


export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const { title, description, duration, difficulty, goals, body } = await req.json();
        const userId = parseInt(session.user.id);


        if (!title || !description || !duration || !difficulty || !goals || !body) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const newWorkout = await prisma.workout.create({
            data: {
                userId,
                title,
                description,
                duration,
                difficulty,
                goals,
                body,

            }
        });
        return NextResponse.json(
            {
                success: true,
                message: 'Content created successfully',
                data: newWorkout
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error while creating workouts:", error);
        return NextResponse.json({ success: false, error: "Failed to create a workout" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {


        const workouts = await prisma.workout.findMany();
        return NextResponse.json(
            {
                success: true,
                message: 'Content created successfully',
                data: workouts
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error while creating workouts:", error);
        return NextResponse.json({ success: false, error: "Failed to create a workout" }, { status: 500 })
    }
}

export async function GETById(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const workouts = await prisma.workout.findUnique({
            where: {
                id: parseInt(id)
            }
        });
        if (!workouts) {
            return NextResponse.json({ success: false, error: "Workout not found" }, { status: 404 })
        }
        return NextResponse.json(
            {
                success: true,
                //   message: 'Content created successfully',
                data: workouts
            },
        );
    } catch (error) {
        console.error("Error fetching workout:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch workout" }, { status: 500 })
    }
}

export async function Delete(req: NextRequest) {
    try {

        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, error: "Workout id is required" }, { status: 400 })
        }
        const deleteworkout = await prisma.workout.delete(
            {
                where: {
                    id: parseInt(id)
                }
            }
        );
        return NextResponse.json(
            {
                success: true,
                message: 'Workout deleted successfully',
                data: deleteworkout
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error while deleting workouts:", error);
        return NextResponse.json({ success: false, error: "Failed to delete a workout" }, { status: 500 })
    }
}