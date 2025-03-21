import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
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
            email: credentials.email,
          },
        });

        // Check if user exists and validate password
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              email: existingUser.email,
              name: existingUser.name,
            };
          }
          return null; // Invalid password
        }

        // If user doesn't exist, create a new user
        try {
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashedPassword,
              name: credentials.email.split('@')[0], // Use the email prefix as name
            },
          });

          return {
            id: newUser.id.toString(),
            email: newUser.email,
            name: newUser.name,
          };
        } catch (e) {
          console.error(e);
          return null; // Handle any errors during user creation
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Log the profile object for debugging
      console.log("Profile object:", profile);

      if (account?.provider === "google" && profile) {
        if (profile.email && (profile as any).email_verified) {
          token.email_verified = (profile as any).email_verified; // Set email_verified in the token
        }
        console.log("Token object before update:", token);

        token.id = profile.sub;
        token.name = profile.name || profile.email?.split('@')[0]; // Use profile name or email prefix
        token.email = profile.email;

        // Log the token object after update
        // console.log("Token object after update:", token);
      } else if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;

    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        // console.log("Token object in session callback:", token);

        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.email_verified = token.email_verified;

        // console.log("Session object:", session);

      }
      return session;
    },


  },
  pages: {
    signIn: "/login",
  },
};
