-- CreateTable
CREATE TABLE "CompanyInfo" (
    "companyId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyIdNumber" TEXT NOT NULL,
    "legalForm" TEXT NOT NULL,
    "foundingDate" TEXT NOT NULL,
    "registeredOffice" TEXT NOT NULL,
    "shareCapital" TEXT NOT NULL,
    "representation" TEXT NOT NULL,
    "representativeName" TEXT NOT NULL,
    "representativeAddress" TEXT NOT NULL,
    "functionStartDate" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyInfo_pkey" PRIMARY KEY ("companyId")
);
