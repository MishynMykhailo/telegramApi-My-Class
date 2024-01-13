const axios = require("axios");

class ApiService {
  constructor(token) {
    this.token = token;
    this.apiUrl = `https://api.telegram.org/bot${token}/`;
  }

  // Made request with axios on get/post method

  async get(method, params = {}) {
    return await axios.get(`${this.apiUrl}${method}`, { params });
  }

  async post(method, data = {}) {
    return await axios.post(`${this.apiUrl}${method}`, data);
  }
}
module.exports = ApiService;
