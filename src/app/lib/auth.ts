import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                username: { label: 'Email', type: 'text', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' }
            },
            async authorize(credentials: any) {
                
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email: credentials.username
                    }
                });

                // If user exists, check password
                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.username,
                            email: existingUser.email // Return email instead of password
                        };
                    } else {
                        throw new Error('Invalid password'); // Throw error for invalid password
                    }
                }

                // If user doesn't exist, you could throw an error or return null
                throw new Error('No user found with that email');
            },
        })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub;
            return session;
        }
    }
};
