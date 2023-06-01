const { NotFoundError } = require("../errors");
const ApplicationController = require("./ApplicationController");

describe("ApplicationController", () => {
  let controller;

  beforeEach(() => {
    controller = new ApplicationController();
  });

  describe("handleGetRoot", () => {
    it("should respond with status 200 and a JSON object", () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      controller.handleGetRoot(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "OK",
        message: "BCR API is up and running!",
      });
    });
  });

  describe("handleNotFound", () => {
    it("should respond with status 404 and a JSON object containing error details", () => {
      const req = {
        method: "GET",
        url: "/path",
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      controller.handleNotFound(req, res);

      const expectedError = new NotFoundError(req.method, req.url);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: expectedError.name,
          message: expectedError.message,
          details: expectedError.details,
        },
      });
    });
  });

  describe("handleError", () => {
    it("should respond with status 500 and a JSON object containing error details", () => {
      const error = new Error("Something went wrong");
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      controller.handleError(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: {
          name: error.name,
          message: error.message,
          details: error.details || null,
        },
      });
    });
  });

  describe("getOffsetFromRequest", () => {
    it("should return the correct offset value based on the request query parameters", () => {
      const req = {
        query: {
          page: 2,
          pageSize: 20,
        },
      };

      const offset = controller.getOffsetFromRequest(req);

      expect(offset).toBe(20);
    });

    it("should return the default offset value when query parameters are not provided", () => {
      const req = {
        query: {},
      };

      const offset = controller.getOffsetFromRequest(req);

      expect(offset).toBe(0);
    });
  });

  describe("buildPaginationObject", () => {
    it("should return a pagination object with correct values", () => {
      const req = {
        query: {
          page: 2,
          pageSize: 10,
        },
      };
      const count = 35;

      const pagination = controller.buildPaginationObject(req, count);

      expect(pagination).toEqual({
        page: 2,
        pageCount: 4,
        pageSize: 10,
        count: 35,
      });
    });

    it("should return a pagination object with default values when query parameters are not provided", () => {
      const req = {
        query: {},
      };
      const count = 35;

      const pagination = controller.buildPaginationObject(req, count);

      expect(pagination).toEqual({
        page: 1,
        pageCount: 4,
        pageSize: 10,
        count: 35,
      });
    });
  });

  
});
