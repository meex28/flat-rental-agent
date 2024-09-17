/*
  Warnings:

  - Added the required column `location_normalized_name` to the `OfferRequirements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OfferRequirements" ADD COLUMN     "location_normalized_name" TEXT NOT NULL;
