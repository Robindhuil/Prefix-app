"use server";

import prisma from "@/lib/prisma";

export async function getCompanyInfoAction() {
    try {
        const company = await prisma.companyInfo.findFirst({
            select: {
                companyId: true,
                companyName: true,
                companyIdNumber: true,
                legalForm: true,
                foundingDate: true,
                registeredOffice: true,
                shareCapital: true,
                representation: true,
                representativeName: true,
                representativeAddress: true,
                functionStartDate: true,
                contactEmail: true,
            },
        });

        if (!company) {
            return { success: false, error: "No company info found" };
        }

        return {
            success: true,
            data: {
                ...company,
                foundingDate: company.foundingDate.toISOString().split("T")[0],
                functionStartDate: company.functionStartDate.toISOString().split("T")[0],
            },
        };
    } catch (error) {
        console.error("getCompanyInfoAction error:", error);
        return { success: false, error: "Failed to load company info" };
    }
}