const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
    it('should verify the contents of the jwt', () => {
        const user = {_id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const token = new User(user).generateAuthToken();

        // mock req, res, next
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const res = {};
        const next = jest.fn();

        // invoke auth
        auth(req, res, next);

        // verify results
        expect(req.user).toMatchObject(user);
    });
});