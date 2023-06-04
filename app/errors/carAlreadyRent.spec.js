const CarAlreadyRentedError = require("./CarAlreadyRentedError");

describe("CarAlreadyRentedError", () => {
  it("should have the correct message and details", () => {
    const car = { id: 1, name: "Car A" };
    const error = new CarAlreadyRentedError(car);

    expect(error.message).toBe("Car A is already rented!!");
    expect(error.details).toEqual({ car });
  });
});
