/*
  Warnings:

  - Changed the type of `chat_id` on the `TelegramBotUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TelegramBotUser" DROP COLUMN "chat_id",
ADD COLUMN     "chat_id" BIGINT NOT NULL;
