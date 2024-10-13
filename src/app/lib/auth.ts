import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              email: existingUser.email,
              name: existingUser.name,
            }
          }
          return null;
        }

        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.email.split('@')[0],
              age: 0, // Add a default value for age
            }
          });

          return {
            id: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
          }
        } catch (e) {
          console.error(e);
        }
        return null
      },
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
}