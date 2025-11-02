// types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: string;
        role: "USER" | "ADMIN";
        isActive?: boolean;
    }

    interface Session {
        user: {
            id: string;
            role: "USER" | "ADMIN";
            isActive?: boolean;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: "USER" | "ADMIN";
        isActive?: boolean;
    }
}