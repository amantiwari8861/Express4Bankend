const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    id: Number,
    street: String,
    city: String,
    state: String,
    pincode: Number,
    country: String,
});

const addressModel = mongoose.model("address", addressSchema);
module.exports = addressModel;
