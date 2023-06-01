const {
    EmailNotRegisteredError,
    WrongPasswordError,
    EmailAlreadyTakenError,
    RecordNotFoundError,
  } = require("../errors");
  const AuthenticationController = require("./AuthenticationController");
  
  describe("AuthenticationController", () => {
    let authenticationController;
  
    beforeEach(() => {
      // Mock dependencies
      const userModel = {};
      const roleModel = {};
      const bcrypt = {
        hashSync: jest.fn(),
        compareSync: jest.fn(),
      };
      const jwt = {
        sign: jest.fn(),
        verify: jest.fn(),
      };
  
      // Create a new instance of AuthenticationController
      authenticationController = new AuthenticationController({
        userModel,
        roleModel,
        bcrypt,
        jwt,
      });
    });
  
    describe("handleLogin", () => {
      it("should return 404 if user email is not registered", async () => {
        const req = { body: { email: "test@example.com", password: "password" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock userModel.findOne to return null
        authenticationController.userModel.findOne = jest.fn().mockResolvedValue(null);
  
        await authenticationController.handleLogin(req, res);
  
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.any(EmailNotRegisteredError));
      });
  
      it("should return 401 if password is incorrect", async () => {
        const req = { body: { email: "test@example.com", password: "password" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const user = { encryptedPassword: "hashedPassword" };
  
        // Mock userModel.findOne to return the user
        authenticationController.userModel.findOne = jest.fn().mockResolvedValue(user);
        // Mock bcrypt.compareSync to return false
        authenticationController.bcrypt.compareSync.mockReturnValue(false);
  
        await authenticationController.handleLogin(req, res);
  
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.any(WrongPasswordError));
      });
  
      it("should return 201 with accessToken if login is successful", async () => {
        const req = { body: { email: "test@example.com", password: "password" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const user = { encryptedPassword: "hashedPassword" };
        const role = {};
  
        // Mock userModel.findOne to return the user
        authenticationController.userModel.findOne = jest.fn().mockResolvedValue(user);
        // Mock bcrypt.compareSync to return true
        authenticationController.bcrypt.compareSync.mockReturnValue(true);
        // Mock createTokenFromUser to return an accessToken
        authenticationController.createTokenFromUser = jest.fn().mockReturnValue("accessToken");
  
        await authenticationController.handleLogin(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ accessToken: "accessToken" });
      });
    });
  
    describe("handleRegister", () => {
      it("should return 422 if email is already taken", async () => {
        const req = { body: { name: "Test User", email: "test@example.com", password: "password" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
        // Mock userModel.findOne to return a user
        authenticationController.userModel.findOne = jest.fn().mockResolvedValue({});
  
        await authenticationController.handleRegister(req, res);
  
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith(expect.any(EmailAlreadyTakenError));
      });
  
      it("should return 201 with accessToken if registration is successful", async () => {
        const req = { body: { name: "Test User", email: "test@example.com", password: "password" } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const role = { id: 1 };
  
        // Mock userModel.findOne to return null
        authenticationController.userModel.findOne = jest.fn().mockResolvedValue(null);
        // Mock roleModel.findOne toclear return a role
        authenticationController.roleModel.findOne = jest.fn().mockResolvedValue(role);
        // Mock userModel.create to return a new user
        authenticationController.userModel.create = jest.fn().mockResolvedValue({ id: 1 });
        // Mock createTokenFromUser to return an accessToken
        authenticationController.createTokenFromUser = jest.fn().mockReturnValue("accessToken");
  
        await authenticationController.handleRegister(req, res);
  
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ accessToken: "accessToken" });
      });
    });
  
    // Add more test cases for other methods in the AuthenticationController class
  });
  