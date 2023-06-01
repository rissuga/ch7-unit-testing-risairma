const request = require('supertest');
const app = require('../../app');

describe('GET /v1/auth/whoami', () => {
  let jwtTokenUser = '';

  beforeEach(async () => {
    const user = {
      email: 'fikri@binar.co.id',
      password: '123456'
    };
    const response = await request(app).post('/v1/auth/login').send(user);
    jwtTokenUser = response.body.accessToken;
  });

  it('it must success get user info from user login', async () => {
    const response = await request(app)
      .get('/v1/auth/whoami')
      .set('authorization', 'Bearer ' + jwtTokenUser);
    expect(response.statusCode).toBe(200);
  });
});
