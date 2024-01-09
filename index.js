const axios = require("axios");
require("dotenv").config();

class TelegramBot {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}/`;
    this.currentState = {};
    this.offset = 0; // Используется для отслеживания последнего обновления
  }
  async request(method, data = {}) {
    const post = await axios.post(`${this.apiUrl}${method}`, data);
    const get = await axios.get(`${this.apiUrl}${method}`, { params: data });
    return { post, get };
  }

  async getUpdates() {
    const response = await this.request("getUpdates", {
      offset: this.offset + 1,
    });
    const updates = response.result;

    if (updates.length > 0) {
      this.handleUpdates(updates);
    }

    // Set the offset to the highest update_id to avoid processing the same update multiple times
    if (updates.length > 0) {
      const maxUpdateId = Math.max(
        ...updates.map((update) => update.update_id)
      );
      this.offset = maxUpdateId;
    }
  }

  async launch() {
    console.log("Launching the bot...");

    // Periodically poll for updates (adjust the interval based on your needs)
    setInterval(async () => {
      await this.getUpdates();
    }, 1000);
  } 
}

const bot = new TelegramBot(process.env.TOKEN);
bot.launch();
