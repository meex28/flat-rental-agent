import {Telegraf} from "telegraf";

export let telegramBot: Telegraf;
export const botSubscribedUsers: number[] = [];

export const launchTelegramBot = async () => {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  telegramBot = new Telegraf(telegramBotToken!!);
  telegramBot.start((ctx) => {
    const userId = ctx.from.id;
    if (!botSubscribedUsers.includes(userId)) {
      botSubscribedUsers.push(userId);
      ctx.reply('You have been added to the notification list!');
    } else {
      ctx.reply('You are already in the notification list!');
    }
  });

  await telegramBot.launch();
}
