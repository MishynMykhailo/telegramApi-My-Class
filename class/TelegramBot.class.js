const axios = require("axios");
require("dotenv").config();

class TelegramBot {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}/`;
    this.currentState = {};
    this.offset = 0; // Используется для отслеживания последнего обновления
    this.isFetchingUpdates = false;
    this.commandHandlers = {};
    this.callbackHandlers = {};
  }
  // Made request with axios on get/post method
  request() {
    const post = async (method, data = {}) =>
      await axios.post(`${this.apiUrl}${method}`, data);
    const get = async (method, data = {}) =>
      await axios.get(`${this.apiUrl}${method}`, { params: data });
    return { post, get };
  }
  // get telegrma update
  async getUpdates() {
    if (this.isFetchingUpdates) {
      // If a request is already in progress, skip this iteration
      return;
    }

    try {
      this.isFetchingUpdates = true; // Set the flag to indicate that a request is in progress

      const response = await this.request().get("getUpdates", {
        offset: this.offset + 1,
      });
      const updates = response.data.result;

      if (updates.length > 0) {
        await this.processUpdates(updates);
      }

      // Update the offset
      if (updates.length > 0) {
        const maxUpdateId = Math.max(
          ...updates.map((update) => update.update_id)
        );
        this.offset = maxUpdateId;
      }
    } catch (error) {
      console.error("Error getting updates:", error);
    } finally {
      this.isFetchingUpdates = false; // Reset the flag after the request is complete
    }
  }
  // catch update
  async processUpdates(updates) {
    for (const update of updates) {
      const { message, callback_query } = update;

      console.log("update", update);

      // callback_query logics
      if (callback_query) {
        const { data, message } = callback_query;
        if (this.callbackHandlers[data]) {
          await this.answerCallbackQuery(callback_query.id);
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
  // BUTTONS LOGICS

  inlineKeyboard(buttons = [{ text, callback_data, url }]) {
    const replyMarkup = {
      inline_keyboard: [[...buttons]],
    };
    return replyMarkup;
  }

  replyKeyboardMarkup(buttons = [{ text, callback_data }]) {
    const replyMarkup = {
      keyboard: [[...buttons]],
      resize_keyboard: function () {
        this.resize_keyboard = true;
        return this;
      },
    };

    return replyMarkup;
  }
  // This method need for inline btns, that off active status on btn;
  async answerCallbackQuery(callbackQueryId) {
    try {
      await this.request().post("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
      });
      console.log("Callback query answered:", callbackQueryId);
    } catch (error) {
      console.error("Error answering callback query:", error.message);
    }
  }
  // bot.action("flip_a_coin", async (ctx) => {
  //   await ctx.editMessageText(
  //     `${getCoinSide()}\nОтредактировано: ${new Date().toISOString()}`,
  //     coinInlineKeyboard
  //   );
  // });

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
    await this.request().post("setMyCommands", commandsArray);
  }
  // sendMessage
  async sendMessage(chat_id, text, params = {}) {
    console.log(params);
    try {
      const response = await this.request().post("sendMessage", {
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
      await this.getUpdates();
    }, 1000);
  }
}

module.exports = TelegramBot;
