import { auth } from "@/lib/auth"  // získa aktuálnu session (náhrada getServerSession)
import type { Session } from "next-auth"

/**
 * Zistí, či aktuálny používateľ je ADMIN
 * Dá sa volať jednoducho: await isAdmin()
 */
export async function isAdmin(): Promise<boolean> {
    const session: Session | null = await auth()
    if (!session?.user) return false

    const user = session.user as any

    if (typeof user.role === "string" && user.role.toUpperCase() === "ADMIN") return true
    if (Array.isArray(user.roles) && user.roles.some((r: string) => r.toUpperCase() === "ADMIN")) return true
    if (user.isAdmin === true) return true

    for (const [key, val] of Object.entries(user)) {
        if (key.toLowerCase().includes("role")) {
            if (typeof val === "string" && val.toUpperCase() === "ADMIN") return true
            if (Array.isArray(val) && val.some((r: any) => String(r).toUpperCase() === "ADMIN")) return true
        }
    }

    return false
}
