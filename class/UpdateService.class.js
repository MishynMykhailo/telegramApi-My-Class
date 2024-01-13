class UpdateService {
  constructor(apiService, telegramBot) {
    this.apiService = apiService;
    this.telegramBot = telegramBot;
    this.offset = 0;
    this.isFetchingUpdates = false;
  }
  async getUpdates() {
    if (this.isFetchingUpdates) {
      // If a request is already in progress, skip this iteration
      return;
    }

    try {
      this.isFetchingUpdates = true; // Set the flag to indicate that a request is in progress

      const response = await this.apiService.get("getUpdates", {
        offset: this.offset + 1,
      });
      const updates = response.data.result;

      if (updates.length > 0) {
        await this.telegramBot.processUpdates(updates);
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
}
module.exports = UpdateService;
