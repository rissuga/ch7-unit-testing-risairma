require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const { AuthenticationController } = require('../../app/controllers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Role } = require('../../app/models');

// Define the Class
const roleModel = Role;
const userModel = User;
const authenticationController = new AuthenticationController({
    bcrypt,
    jwt,
    roleModel,
    userModel,
});

describe('POST /v1/auth/login', () => {
    const mockUser = {
        email: 'fikri@binar.co.id',
        password: '123456',
    };

    const mockUnregisteredUser = {
        email: 'JennieRubbeya@binar.co.id',
        password: '123456',
    };

    const mockWrongPasswordUser = {
        email: 'fikri@binar.co.id',
        password: 'Hayolosalah',
    };

    const mockInvalidInputUser = {
        email: { email: 'johnny@binar.co.id' },
        password: '654321',
    };

    it('it must success login by user inputted data', async () => {
        const response = await request(app).post('/v1/auth/login').send(mockUser);
        expect(response.statusCode).toBe(201);
    });

    it('it must failed due to unregistered account', async () => {
        const response = await request(app).post('/v1/auth/login').send(mockUnregisteredUser);
        expect(response.statusCode).toBe(404);
    });

    it('it must failed due to user wrong input password', async () => {
        const response = await request(app).post('/v1/auth/login').send(mockWrongPasswordUser);
        expect(response.statusCode).toBe(401);
    });

    it('it must failed due to invalid user inputted data', async () => {
        const response = await request(app).post('/v1/auth/login').send(mockInvalidInputUser);
        expect(response.statusCode).toBe(500);
    });
});