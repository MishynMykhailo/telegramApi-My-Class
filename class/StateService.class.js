class StateService {
  constructor() {
    this.state = {}; // Хранение всех значений состояний
    this.currentState = null; // Хранение текущего состояния
  }

  setState = ({ key, value }) => {
    if (this.state[key]) {
      console.log("Error, this state already exists");
    }
    return (this.state[key] = value);
  };

  setCurrentState = (key) => {
    if (this.state[key]) {
      this.currentState = this.state[key];
    } else {
      console.log("Error, state not found");
    }
  };

  getCurrentState = () => {
    return this.currentState;
  };

  updateState = ({ key, value }) => {
    if (!this.currentState[key]) {
      console.log("Error,this state does not exists");
    }
    this.currentState[key] = value;
  };
}
module.exports = StateService;
