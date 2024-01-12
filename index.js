// Ваш основной файл
const TelegramBot = require("./class/TelegramBot.class.js");

const bot = new TelegramBot(process.env.TOKEN);

bot.hears("start", (context) => {
  bot.sendMessage(context.chat.id, "__hello__", {
    reply_markup: bot.inlineKeyboard([
      { text: "поздороваться", callback_data: "hi" },
      { text: "попрощаться", callback_data: "bb" },
    ]),
    parse_mode: "MarkDownV2",
  });
});
bot.action("hi", (context) => {
  // console.log("Action:hi", context.message.chat.id);
  bot.sendMessage(context.chat.id, "Hello,my name Alfredo");
});
bot.action("bb", (context) => {
  bot.sendMessage(context.chat.id, "Goodbay, have a good day");
});
bot.launch();
