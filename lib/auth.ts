import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                // Simple hardcoded credentials for testing
                // Replace with your actual authentication logic (e.g., database check)
                if (credentials.username === "test" && credentials.password === "password") {
                    return {
                        id: "1",
                        name: credentials.username,
                        email: "test@example.com",
                    };
                }
                console.error("Authorization failed: Invalid credentials");
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    debug: true, // Enable debug logs for development
});