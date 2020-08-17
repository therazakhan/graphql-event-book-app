const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');

const rootReducer = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver
};

module.exports = rootReducer;