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

describe('GET /v1/cars/:id', () => {
    let idCar = 1;

    it('it must success get car by id', async () => {
        const response = await request(app).get(`/v1/cars/${idCar}`);
        expect(response.statusCode).toBe(200);
    });
});