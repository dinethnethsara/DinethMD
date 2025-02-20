const mongoose = require('mongoose');

module.exports = {
    // MongoDB connection configuration
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/dinethmd',
    
    // Database connection options
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    },

    // Connect to MongoDB
    connect: async () => {
        try {
            await mongoose.connect(module.exports.mongoURI, module.exports.options);
            console.log('📦 Connected to MongoDB successfully');
        } catch (error) {
            console.error('❌ MongoDB connection error:', error);
            process.exit(1);
        }
    },

    // Disconnect from MongoDB
    disconnect: async () => {
        try {
            await mongoose.disconnect();
            console.log('📦 Disconnected from MongoDB');
        } catch (error) {
            console.error('❌ MongoDB disconnection error:', error);
        }
    }
};