const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
    beforeEach(() =>  server = require('../../index'));
    afterEach( async () => {
        await server.close();
        await Genre.remove({});
     });

    describe('GET /',  () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some( g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some( g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id',  () => {
        it('should return a specific genre for valid id', async () => {
            const genre = new Genre( { name: 'genre1' } );
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.body).toMatchObject({ name: 'genre1' });

        });

        it('should return 404 for invalid id', async () => {

            const res = await request(server).get('/api/genres/w1');
            expect(res.status).toBe(404);

        });

        it('should return 404 if genre not found', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/' + id);
            expect(res.status).toBe(404);

        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const exec = async () => {
            // call api to save to genre
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should create a new genre for a valid request and no auth token', async () =>  {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 for genre less than 5 chars', async () => {
            name = '123';
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return 400 for genre more than 50 chars', async () => {
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should save a valid genre with the correct auth token', async() => {
            // call api to save to genre
            await exec();

            // select genre from the database
            const genre = await Genre.find({name: 'genre1'});
            expect(genre).not.toBeNull();

        });

        it('should return a the newly created genre with the correct auth token', async() => {
            const res = await exec();

            // verify genre response
            expect(res.body).toMatchObject({name: 'genre1'});
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name, newName;
        let isAdmin;
        let genre;

        beforeEach(async () => {
            isAdmin = true;
            user = {_id: mongoose.Types.ObjectId(), isAdmin};
            token = new User(user).generateAuthToken();
            name = 'genre1';
            newName = 'genre2';

            // populate a genre
            genre = new Genre({name});
            await genre.save();
        });


        const exec = async () => {
            // call api to save to genre
            return await request(server)
                .put('/api/genres/' + genre._id)
                .set('x-auth-token', token)
                .send({ name: newName });
        };

        it('should return 400 for genre with char less than 5', async () => {
            newName = '123';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 for genre with char less more than 50', async () => {
            newName = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 for unknown id', async () => {
            genre._id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should update genre for a valid id', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({_id: genre._id.toHexString(), name: newName});
        });
    });
});
