-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "telegram_chat_id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
