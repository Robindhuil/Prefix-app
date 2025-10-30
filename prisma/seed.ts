import prisma from "../lib/prisma"
import { hash } from "bcryptjs"

async function main() {
    const hashedPassword = await hash("heslo123", 12)

    await prisma.user.upsert({
        where: { username: "admin" },
        update: {
            email: "admin@example.com",
            name: "Admin",
            hashedpassword: hashedPassword,
            role: "ADMIN",
            isActive: true,
        },
        create: {
            username: "admin",
            email: "admin@example.com",
            name: "Admin",
            hashedpassword: hashedPassword,
            role: "ADMIN",
            isActive: true,
        },
    })


    const existing = await prisma.companyInfo.findFirst()

    if (existing) {
        await prisma.companyInfo.update({
            where: { companyId: existing.companyId },
            data: {
                companyName: "PREFIX s.r.o.",
                companyIdNumber: "51 893 258",
                legalForm: "Spoločnosť s ručením obmedzeným",
                foundingDate: new Date("2018-09-06"),
                registeredOffice: "Turáková 945/2, 013 01 Teplička nad Váhom",
                shareCapital: "5 000 EUR",
                representation: "Konateľ koná samostatne.",
                representativeName: "Róbert Gaššo",
                representativeAddress: "Turáková 945/2, Teplička nad Váhom",
                functionStartDate: new Date("2018-09-06"),
                contactEmail: "dHt9K@example.com",
            },
        })
        console.log("✅ Company info updated!")
    } else {
        await prisma.companyInfo.create({
            data: {
                companyId: "MAIN",
                companyName: "PREFIX s.r.o.",
                companyIdNumber: "51 893 258",
                legalForm: "Spoločnosť s ručením obmedzeným",
                foundingDate: new Date("2018-09-06"),
                registeredOffice: "Turáková 945/2, 013 01 Teplička nad Váhom",
                shareCapital: "5 000 EUR",
                representation: "Konateľ koná samostatne.",
                representativeName: "Róbert Gaššo",
                representativeAddress: "Turáková 945/2, Teplička nad Váhom",
                functionStartDate: new Date("2018-09-06"),
                contactEmail: "dHt9K@example.com",
            },
        })
        console.log("✅ Company info created!")
    }

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
