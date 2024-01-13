class KeyboardService {
    constructor(apiService) {
      this.apiService = apiService
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
      await this.apiService.post("answerCallbackQuery", {
        callback_query_id: callbackQueryId,
      });
      console.log("Callback query answered:", callbackQueryId);
    } catch (error) {
      console.error("Error answering callback query:", error.message);
    }
  }
}
module.exports = KeyboardService;
