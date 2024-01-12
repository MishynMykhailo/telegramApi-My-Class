// Ваш основной файл
const TelegramBot = require("./class/TelegramBot.class.js");

const bot = new TelegramBot(process.env.TOKEN);

bot.hears("start", (context) => {
  // bot.sendMessage(context.chat.id, "__hello__", {
  //   reply_markup: bot.inlineKeyboard([
  //     { text: "поздороваться", callback_data: "hi" },
  //     { text: "попрощаться", callback_data: "bb" },
  //   ]),
  //   parse_mode: "MarkDownV2",
  // });
  context.reply("__hello__", {
    reply_markup: bot.replyKeyboardMarkup([
      { text: "поздороваться", callback_data: "hi" },
      { text: "попрощаться", callback_data: "bb" },
    ]).resize_keyboard(),
    parse_mode: "MarkDownV2",
  });
});
bot.action("hi", (context) => {
  context.reply("Hello,I'm Alfredo");
});
bot.action("bb", (context) => {
  context.reply("Goodbay, have a good day");
});
bot.launch();
