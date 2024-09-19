/*
  Warnings:

  - You are about to drop the column `location` on the `OfferRequirements` table. All the data in the column will be lost.
  - You are about to drop the column `location_normalized_name` on the `OfferRequirements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OfferRequirements" DROP COLUMN "location",
DROP COLUMN "location_normalized_name";

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
CREATE UNIQUE INDEX "Location_offerRequirementsId_key" ON "Location"("offerRequirementsId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_offerRequirementsId_fkey" FOREIGN KEY ("offerRequirementsId") REFERENCES "OfferRequirements"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
