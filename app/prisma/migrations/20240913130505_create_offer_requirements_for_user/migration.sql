-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'FLAT', 'LAND');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('RENT', 'SALE');

-- CreateTable
CREATE TABLE "OfferRequirements" (
    "id" SERIAL NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "ownershipType" "OwnershipType" NOT NULL,
    "localization" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OfferRequirements_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfferRequirements" ADD CONSTRAINT "OfferRequirements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
