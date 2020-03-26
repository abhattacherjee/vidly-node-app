const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/returns', () => {
    let rental;
    let customerId;
    let movieId;

    beforeEach( async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '303-123-12345'
            },
            movies: [{
                _id: movieId,
                title: 'movie_1',
                genre: {name: 'genre_1'},
                numberInStock: 10,
                dailyRentalRate: 10
            }]
        });
        await rental.save();
    });

    afterEach( async () => {
        await server.close();
        await Rental.remove({});
    });

    it('should return 401 unauthorized if client is not logged in', async () => {
        const result = await request(server)
            .post('/api/returns')
            .send({customerId, movieId});

        expect(result.status).toBe(401);
    });

    it ('should return 400 Bad Request if customerId is not provided', async () => {
        let token = new User().generateAuthToken();
        const result = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({movieId});
        expect(result.status).toBe(400);
    });

    it ('should return 400 Bad Request if movieId is not provided', async () => {
        let token = new User().generateAuthToken();
        const result = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId});
        expect(result.status).toBe(400);
    });
});