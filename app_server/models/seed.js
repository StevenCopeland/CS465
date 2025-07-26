// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');
const fs = require('fs');

const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

Mongoose.connection.once('open', async () => {
    console.log('MongoDB connection open. Seeding data...');

    try {
        await Trip.deleteMany({});
        console.log('Old trips deleted');

        await Trip.insertMany(trips);
        console.log('New trips inserted');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await Mongoose.connection.close();
        console.log('MongoDB connection closed.');
        process.exit(0);
    }
});