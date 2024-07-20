import mongoose from "mongoose";
const connection = {};

async function dbConnect() {
    if (connection.isConnected) {
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        console.error('Error details:', error);
    }
}

export default dbConnect;
