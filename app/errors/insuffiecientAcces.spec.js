const InsufficientAccessError = require("./InsufficientAccessError");

describe("InsufficientAccessError", () => {
  it("should have correct message and role", () => {
    const role = "admin";
    const error = new InsufficientAccessError(role);

    expect(error.message).toBe("Access forbidden!");
    expect(error.role).toBe(role);
  });

  it("should have correct details", () => {
    const role = "user";
    const error = new InsufficientAccessError(role);

    expect(error.details).toEqual({
      role: role,
      reason: `${role} is not allowed to perform this operation.`
    });
  });
});
