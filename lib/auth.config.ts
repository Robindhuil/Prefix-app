// lib/auth.config.ts
import { PrismaClient } from '../app/generated/prisma/client';
import { compare } from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

const prisma = new PrismaClient();

export const authConfig: NextAuthConfig = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const username = credentials?.username as string | undefined;
                const password = credentials?.password as string | undefined;

                if (!username || !password) return null;

                const user = await prisma.user.findUnique({
                    where: { username },
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        role: true,
                        hashedpassword: true,
                        isActive: true,
                    },
                });

                if (!user) return null;
                if (!user.isActive) throw new Error('ACCOUNT_DEACTIVATED');

                const isValid = await compare(password, user.hashedpassword);
                if (!isValid) return null;

                return {
                    id: user.id.toString(),
                    name: user.username,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                };
            },
        }),
    ],
    pages: { signIn: '/login' },
    session: { strategy: 'jwt', maxAge: 30 * 60 },
    callbacks: {
        // PRIDAJ ID DO JWT + SESSION
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;           // ← PRIDAJ!
                token.role = user.role;
                token.isActive = user.isActive;
            }

            // Overenie aktivity pri každom requeste
            if (token?.name && !token.id) {
                const dbUser = await prisma.user.findUnique({
                    where: { username: token.name as string },
                    select: { id: true, isActive: true },
                });
                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.isActive = dbUser.isActive;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
                session.user.role = token.role as "USER" | "ADMIN";
                session.user.isActive = token.isActive as boolean;
            }

            if (token.isActive === false) {
                session.user = {
                    id: token.id as string,
                    name: 'Deactivated',
                    email: '',
                    emailVerified: null,
                    role: 'USER' as const,
                    isActive: false,
                };
            }

            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
};