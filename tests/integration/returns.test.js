const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');
const mongoose = require('mongoose');
const moment = require('moment');
let server;

describe('/api/returns', () => {
    let rental;
    let movie;
    let customerId;
    let movieId;

    let token;

    beforeEach( async () => {
        server = require('../../index');

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: 'movie_1',
            genre: {name: 'genre_1'},
            numberInStock: 10,
            dailyRentalRate: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '303-123-12345'
            },
            movie: {
                _id: movieId,
                title: 'movie_1',
                genre: {name: 'genre_1'},
                dailyRentalRate: 10
            }
        });
        await rental.save();
    });

    afterEach( async () => {
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId, movieId});
    };

    it('should return 401 unauthorized if client is not logged in', async () => {
        token = '';
        const result = await exec();
        expect(result.status).toBe(401);
    });

    it ('should return 400 Bad Request if customerId is not provided', async () => {
        customerId = null;
        const result = await exec();
        expect(result.status).toBe(400);
    });

    it ('should return 400 Bad Request if movieId is not provided', async () => {
        movieId = null;
        const result = await exec();
        expect(result.status).toBe(400);
    });

    it('should return 404 Not Found if no rental found for this customer and movie id', async () => {
        //  remove the rental
        await Rental.remove({});

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        const result = await exec();
        expect(result.status).toBe(404);
    });

    it('should return 400 Bad Request if rental is already processed',async () => {
        // set return date to the rental
        rental.dateReturned = Date.now();
        await rental.save();

        // send a request to the api
        const result = await exec();
        expect(result.status).toBe(400);

    });

    it('should return 200 OK if the request is valid', async () => {
        const result = await exec();
        expect(result.status).toBe(200);
    });

    it('should set returned date if the request is valid', async () => {
        await exec();
        const rentalInDB = await Rental.findOne({'customer._id': customerId, 'movie._id': movieId});
        expect(Date.now() - rentalInDB.dateReturned).toBeLessThan(10 * 1000);
    });

    it('should calculate the correct rental fee if the request is valid', async () => {
        rental.rentalDate = moment().add(-5, 'days').toDate();
        await rental.save();

        await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(5 * rental.movie.dailyRentalRate);
    });

    it('should increase the stock of the movie by 1', async () => {
        await exec();
        const movieInDB = await Movie.findById(movie._id);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental in the body of the response', async () => {
        const result = await exec();
        expect(Object.keys(result.body))
            .toEqual(expect.arrayContaining([
                'dateReturned',
                'rentalFee',
                'customer',
                'movie'
            ]));

    });
});