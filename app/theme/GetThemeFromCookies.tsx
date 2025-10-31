"use server";

import { cookies } from "next/headers";

export async function getThemeFromCookies() {
    try {
        const cookieStore = await cookies();
        const theme = cookieStore.get("theme")?.value;
        return theme === "dark" ? "dark" : "light";
    } catch {
        return "light";
    }
}