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
        const { date, calories, protein, carbs, fat } = await req.json();
        const userId = parseInt(session.user.id); // Convert userId to a number

        // Validate input data
        if (
            typeof calories !== "number" ||
            typeof protein !== "number" ||
            typeof carbs !== "number" ||
            typeof fat !== "number"
        ) {
            return NextResponse.json({ message: "Invalid input data" }, { status: 400 });
        }

        // Create the nutrition log
        const nutritionLog = await prisma.nutritionLog.create({
            data: {
                userId,
                date: new Date(date),
                calories,
                protein,
                carbs,
                fat,
            },
        });

        return NextResponse.json(nutritionLog, { status: 201 });
    } catch (error) {
        console.error("Error creating NutritionLog:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const userId = parseInt(session.user.id);

        // Fetch the user's nutrition logs
        const logs = await prisma.nutritionLog.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });

        return NextResponse.json(logs, { status: 200 });
    } catch (error) {
        console.error("Error fetching Nutrition Logs:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
