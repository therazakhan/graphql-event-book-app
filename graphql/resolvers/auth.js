const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });

            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const newUser = new User({
                email: args.userInput.email,
                password: hashedPassword,
            });
            const savedResult = await newUser.save();

            return { ...savedResult._doc, password: null, _id: savedResult.id };
        } catch (err) {
            throw err;
        };
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Wrong credentials!');
        }
        const token = jwt.sign({ userId: user.id, email: email }, 'pokemongo', {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token,
            tokenExpiration: 1
        }
    }
}