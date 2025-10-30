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

                if (!user.isActive) {
                    throw new Error('ACCOUNT_DEACTIVATED');
                }

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
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            // pri prihlásení
            if (user) {
                token.role = user.role;
                token.isActive = user.isActive;
            }

            // pri každom requeste
            if (token?.name) {
                const dbUser = await prisma.user.findUnique({
                    where: { username: token.name as string },
                    select: { isActive: true },
                });

                if (!dbUser || !dbUser.isActive) {
                    token.isActive = false;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                if (token.role === 'ADMIN' || token.role === 'USER') {
                    session.user.role = token.role;
                }
                session.user.isActive = token.isActive as boolean;
            }

            // ❗ ak je zabanovaný, vráť prázdnu session (typovo validnú)
            if (token.isActive === false) {
                session.user = {
                    name: 'Deactivated',
                    email: '',
                    role: 'USER',
                    isActive: false,
                } as any;
            }

            return session;
        },
    },
    debug: process.env.NODE_ENV === 'development',
};
