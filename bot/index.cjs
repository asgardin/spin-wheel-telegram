require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// ✅ создаём бота сначала
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const WEB_APP_URL = "https://spin-wheel-telegram.vercel.app";

// ✅ потом используем bot:
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "🎯 Нажми, чтобы начать игру", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎡 Играть",
            web_app: { url: "https://spin-wheel-telegram.vercel.app" },
          },
        ],
      ],
    },
  });
});
