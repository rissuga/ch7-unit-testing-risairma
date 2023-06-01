require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

const { AuthenticationController, CarController } = require('../../app/controllers');

const { User, Role, Car, UserCar } = require('../../app/models');

//Class Constructor variable
const roleModel = Role;
const userModel = User;
const carModel = Car;
const userCarModel = UserCar;

//Define Class
const authenticationController = new AuthenticationController({
    bcrypt,
    jwt,
    roleModel,
    userModel,
});

const carController = new CarController({ carModel, userCarModel, dayjs });

// Global Func
const getRole = async (role) => {
    return await authenticationController.roleModel.findOne({
        where: { name: authenticationController.accessControl[role] },
    });
};

const generateUser = async (mockData, role) => {
    return await authenticationController.userModel.create({
        name: mockData.name,
        email: mockData.email,
        encryptedPassword: authenticationController.encryptPassword(mockData.password),
        roleId: role.id,
    });
};

describe('POST /v1/cars', () => {
    let token;

    const mockAdmin = {
        name: 'Risa',
        email: 'risa@gmail.com',
        password: '123456',
    };

    const mockCar = {
        name: 'string',
        price: 0,
        image: 'string',
        size: 'string',
    };

    const mockInvalidCar = {
        name: ['test'],
        price: 0,
        image: {
            hehe: 'hehe',
        },
        size: 'string',
    };

    beforeAll(async () => {
        const adminRole = await getRole('ADMIN');
        const user = await generateUser(mockAdmin, adminRole);
        const accessToken = authenticationController.createTokenFromUser(user, adminRole);
        token = accessToken;
    });

    it('it must success add a car', async () => {
        const response = await request(app).post('/v1/cars').set('Authorization', `Bearer ${token}`).send(mockCar);
        expect(response.statusCode).toBe(201);
    });

    it('it must failed add a car due to invalid input data', async () => {
        const response = await request(app).post('/v1/cars').set('Authorization', `Bearer ${token}`).send(mockInvalidCar);
        expect(response.statusCode).toBe(422);
    });
});