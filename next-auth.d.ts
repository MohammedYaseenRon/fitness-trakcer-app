// next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession } from "next-auth";

// Extend the default session and JWT types
declare module "next-auth" {
interface Session {
    user: {
    id: string; // Add the user ID field to the session
    name?: string | null;
    email?: string | null;
    email_verified?: boolean | null;
    image?: string | null;
    } & DefaultSession["user"]; // Merge with default session properties
}

interface JWT {
    id: string; // Add the user ID field to the JWT
    name?: string | null;
    email?: string | null;
    email_verified?: boolean | null;
    image?: string | null;
}
}
