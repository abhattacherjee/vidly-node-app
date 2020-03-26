const request = require('supertest');
const {User} = require('../../models/user');
const { Genre } = require('../../models/genre');
let server;

describe('auth middleware', () => {
    let token;

    beforeEach( () => {
        server = require('../../index');
        token = new User().generateAuthToken();
    } );

    afterEach( async () => {
        await Genre.remove({});
        server.close();
    } );

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    it('should return 401 if no token provided', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token provided', async () => {
        token = 'a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if valid token provided', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
});