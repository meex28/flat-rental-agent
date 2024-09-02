/*
  Warnings:

  - You are about to alter the column `chat_id` on the `TelegramBotUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "TelegramBotUser" ALTER COLUMN "chat_id" SET DATA TYPE INTEGER;
