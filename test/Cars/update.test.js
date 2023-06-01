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

const generateCar = async (mockData) => {
    return await carController.carModel.create({
        name: mockData.name,
        price: mockData.price,
        image: mockData.image,
        size: mockData.image,
        isCurrentlyRented: false,
    });
};

describe('PUT /v1/cars/:id', () => {
    let car, token;

    const mockCreateCar = {
        name: 'string',
        price: 0,
        image: 'string',
        size: 'string',
        isCurrentlyRented: false,
    };

    const mockAdmin = {
        name: 'Risa',
        email: 'risa@gmail.com',
        password: '123456',
    };

    const mockUpdateCar = {
        name: 'string neww',
        price: 0,
        image: 'string.png',
        size: 'string',
    };

    const mockInvalidUpdateCar = {
        name: ['string neww'],
        price: {
            price: 0,
        },
        image: 'string.png',
        size: 'string',
    };

    beforeAll(async () => {
        const adminRole = await getRole('ADMIN');
        const user = await generateUser(mockAdmin, adminRole);
        const accessToken = authenticationController.createTokenFromUser(user, adminRole);
        token = accessToken;
        car = await generateCar(mockCreateCar);
    });

    it('it must success update a car', async () => {
        const response = await request(app).put(`/v1/cars/${car.id}`).set('Authorization', `Bearer ${token}`).send(mockUpdateCar);
        expect(response.statusCode).toBe(200);
    });

    it('it must failed update a car because invalid input data', async () => {
        const response = await request(app).put(`/v1/cars/${car.id}`).set('Authorization', `Bearer ${token}`).send(mockInvalidUpdateCar);
        expect(response.statusCode).toBe(422);
    });
});