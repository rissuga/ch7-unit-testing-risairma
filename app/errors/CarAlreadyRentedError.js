const ApplicationError = require("./ApplicationError");

class CarAlreadyRentedError extends ApplicationError {
  constructor(data) {
    super(`${data.name} is already rented!!`);
    this.car = data;
  }

  get details() {
    return { car: this.car }
  }
}

module.exports = CarAlreadyRentedError;
