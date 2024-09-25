-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'FLAT', 'LAND');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('RENT', 'SALE');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegram_chat_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferRequirements" (
    "id" SERIAL NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "ownershipType" "OwnershipType" NOT NULL,
    "userId" INTEGER NOT NULL,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "minSize" INTEGER,
    "maxSize" INTEGER,

    CONSTRAINT "OfferRequirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "normalized_name" TEXT NOT NULL,
    "distance" INTEGER NOT NULL,
    "offerRequirementsId" INTEGER NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OfferRequirements_userId_key" ON "OfferRequirements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_offerRequirementsId_key" ON "Location"("offerRequirementsId");

-- AddForeignKey
ALTER TABLE "OfferRequirements" ADD CONSTRAINT "OfferRequirements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_offerRequirementsId_fkey" FOREIGN KEY ("offerRequirementsId") REFERENCES "OfferRequirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
