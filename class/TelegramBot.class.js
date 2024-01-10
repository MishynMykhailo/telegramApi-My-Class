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
      const { message } = update;
      if (message) {
        const chatId = message.chat.id;
        const text = message.text;

        // Process commands
        if (text.startsWith("/")) {
          const command = text.slice(1); // удаляем "/"
          console.log(this.commandHandlers);
          if (this.commandHandlers[command]) {
            await this.commandHandlers[command](message);
          }
        }
      }
    }
  }
  // telegram method - sendMessage
  async sendMessage(chatId, text, params = {}) {
    try {
      const response = await this.request().get("sendMessage", {
        chat_id: chatId,
        text: text,
        ...params,
      });
      console.log("Message sent:", response.data.result);
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  }

  hears(command, handler) {
    this.commandHandlers[command] = handler;
  }

  async launch() {
    console.log("Launching the bot...");
    // Periodically poll for updates (adjust the interval based on your needs)
    setInterval(async () => {
      await this.getUpdates();
    }, 1000);
  }
}

module.exports = TelegramBot;
