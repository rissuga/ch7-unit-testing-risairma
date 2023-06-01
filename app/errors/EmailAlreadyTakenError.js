const ApplicationError = require("./ApplicationError");

class EmailAlreadyTakenError extends ApplicationError {
  constructor(data) {
    super(`${data} Has been taken lol!`);
    this.email = data;
  }

  get details() {
    return { email: this.email }
  }
}

module.exports = EmailAlreadyTakenError;
