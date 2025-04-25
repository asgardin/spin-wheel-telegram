require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// Создаём бота
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// URL твоего мини-приложения
const WEB_APP_URL = "https://spin-wheel-telegram.vercel.app";

// Реакция на /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🎯 Нажми, чтобы начать игру", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎡 Играть",
            web_app: { url: WEB_APP_URL },
          },
        ],
      ],
    },
  });
});
