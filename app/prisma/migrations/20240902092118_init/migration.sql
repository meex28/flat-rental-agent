-- CreateTable
CREATE TABLE "TelegramBotUser" (
    "id" SERIAL NOT NULL,
    "chat_id" TEXT NOT NULL,

    CONSTRAINT "TelegramBotUser_pkey" PRIMARY KEY ("id")
);
