const mongoose = require('mongoose');
const { config } = require('./config');

const connectDatabase = async () => {
    try {
        await mongoose.connect(config.db_url);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDatabase