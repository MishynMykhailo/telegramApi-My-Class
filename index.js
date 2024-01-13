// Ваш основной файл
const TelegramBot = require("./class/TelegramBot.class.js");

const bot = new TelegramBot(process.env.TOKEN);

bot.setMyCommands([
  { command: "start", description: "start" },
  { command: "build", description: "build" },
]);
bot.hears("start", (context) => {
  
  context.reply("__hello__", {
    reply_markup: bot.keyboardService.inlineKeyboard([
      { text: "поздороваться", callback_data: "hi" },
      { text: "попрощаться", callback_data: "bb" },
    ]),
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
