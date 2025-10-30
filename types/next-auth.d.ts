import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface User {
        role: "USER" | "ADMIN";
        isActive?: boolean;
    }

    interface Session {
        user: {
            role: "USER" | "ADMIN";
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: "USER" | "ADMIN";
    }
}