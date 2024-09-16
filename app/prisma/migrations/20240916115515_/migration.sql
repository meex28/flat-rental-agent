/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `OfferRequirements` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OfferRequirements_userId_key" ON "OfferRequirements"("userId");
