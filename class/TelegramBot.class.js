const axios = require("axios");
const ApiService = require("./ApiService.class");
const UpdateService = require("./UpdateService.class");
const KeyboardService = require("./KeyboardService.class");
require("dotenv").config();
class TelegramBot {
  constructor(token) {
    this.apiService = new ApiService(token);
    this.updateService = new UpdateService(this.apiService, this);
    this.keyboardService = new KeyboardService(this.apiService);
    this.commandHandlers = {};
    this.callbackHandlers = {};
  }

  // get telegrma update

  // catch update
  async processUpdates(updates) {
    for (const update of updates) {
      const { message, callback_query } = update;

      console.log("update", update);

      // callback_query logics
      if (callback_query) {
        const { data, message } = callback_query;
        if (this.callbackHandlers[data]) {
          await this.keyboardService.answerCallbackQuery(callback_query.id);
          await this.callbackHandlers[data](message);
        }
      }

      // commands this text with "/"

      if (message) {
        const text = message.text;
        // Process commands
        if (text.startsWith("/")) {
          const command = text.slice(1); // удаляем "/"
          if (this.commandHandlers[command]) {
            // Message я передаю как раз все сообщение, чтобы мог его использовать в методе как context
            await this.commandHandlers[command](message);
          }
        }
      }
    }
  }

  action(text, handler) {
    this.callbackHandlers[text] = this.wrapperHandler(handler);
  }
  // Hears for command wtih "/"
  hears(command, handler) {
    this.commandHandlers[command] = this.wrapperHandler(handler);
  }

  // add comfortable logics for answer for question
  wrapperHandler = (handler) => async (message) => {
    const context = {
      message,
      reply: async (text, params = {}) => {
        await this.sendMessage(message.chat.id, text, params);
      },
    };
    await handler(context);
  };
  // END BUTTON LOGICS

  // TELEGRAM methods
  // setMyCommands
  async setMyCommands(commands = [{ command, description }]) {
    const commandsArray = {
      commands,
    };
    await this.apiService.post("setMyCommands", commandsArray);
  }
  // sendMessage
  async sendMessage(chat_id, text, params = {}) {
    console.log(params);
    try {
      const response = await this.apiService.post("sendMessage", {
        chat_id,
        text,
        ...params,
      });
      console.log("Message sent:", response.data.result);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }

  //  telegram methods END
  async launch() {
    console.log("Launching the bot...");
    // Periodically poll for updates (adjust the interval based on your needs)
    setInterval(async () => {
      await this.updateService.getUpdates();
    }, 1000);
  }
}

module.exports = TelegramBot;
