
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function connect() {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    catch (err) {
        console.error(err);
        await mongoose.disconnect();
        console.log("mongo db disconnected!");
    }
}
process.on("SIGINT", async () => {
    console.log("Received SIGINT. Gracefully shutting down...");
    await mongoose.disconnect();
    console.log("MongoDB disconnected!");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Received SIGTERM. Gracefully shutting down...");
    await mongoose.disconnect();
    console.log("MongoDB disconnected!");
    process.exit(0);
});
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await mongoose.disconnect();
    process.exit(1);
});

exports.connect = connect;