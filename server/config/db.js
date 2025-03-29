const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "buygo_db"
        });

        console.log("Connected to DB".white.bgCyan);
    } catch (error) {
        console.log("Error while connecting to DB".white.bgRed);
        console.log(error);
    }
}

module.exports = connectDb;