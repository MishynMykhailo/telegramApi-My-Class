// Ваш основной файл
const TelegramBot = require("./class/TelegramBot.class.js");

const bot = new TelegramBot(process.env.TOKEN);
bot.hears("start", (context) => {
  bot.sendMessage(context.chat.id, "__hello__", {
    reply_markup: {
      keyboard: {
        inline_keyboard: [
          [{ text: "params", callback_data: "params" }],
          [{ text: "params", callback_data: "params" }],
        ],
      },
    },
  });
});

bot.launch();
