import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const chatHistory = await prisma.chatMessage.findMany({
      orderBy: { createdAt: "asc" },
    });

    return new Response(JSON.stringify(chatHistory), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch chat history" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
