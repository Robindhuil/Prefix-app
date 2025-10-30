"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
    companyId: z.string(),
    companyName: z.string().min(1),
    companyIdNumber: z.string().min(1),
    legalForm: z.string().min(1),
    foundingDate: z.string(),
    registeredOffice: z.string().min(1),
    shareCapital: z.string().min(1),
    representation: z.string().min(1),
    representativeName: z.string().min(1),
    representativeAddress: z.string().min(1),
    functionStartDate: z.string(),
    contactEmail: z.string().email(),
});

export async function updateCompanyInfoAction(formData: FormData) {
    try {
        const data = Object.fromEntries(formData.entries());
        const validated = updateSchema.parse(data);

        await prisma.companyInfo.upsert({
            where: { companyId: validated.companyId },
            update: {
                ...validated,
                foundingDate: new Date(validated.foundingDate),
                functionStartDate: new Date(validated.functionStartDate),
            },
            create: {
                ...validated,
                companyId: validated.companyId,
                foundingDate: new Date(validated.foundingDate),
                functionStartDate: new Date(validated.functionStartDate),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("updateCompanyInfoAction error:", error);
        return { success: false, error: "Failed to save company info" };
    }
}