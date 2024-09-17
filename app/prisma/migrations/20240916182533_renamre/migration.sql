/*
  Warnings:

  - You are about to drop the column `localization` on the `OfferRequirements` table. All the data in the column will be lost.
  - Added the required column `location` to the `OfferRequirements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferRequirements" DROP COLUMN "localization",
ADD COLUMN     "location" TEXT NOT NULL;
