import prisma from "../lib/prisma"
import { hash } from "bcryptjs"

async function main() {
    const hashedPassword = await hash("heslo123", 12)

    await prisma.user.create({
        data: {
            username: "admin",
            email: "admin@example.com",
            name: "Admin",
            hashedpassword: hashedPassword,
            role: "ADMIN",
            isActive: true,
        },
    })

    console.log("Seed finished!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
