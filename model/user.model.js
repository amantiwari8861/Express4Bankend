const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
    gender: String, // single char, store as String
    mobileNo: Number,
    isMember: Boolean,
    dob: Date,
    fee: Number,
    email: String,
    password: String,
    joinedAt: Date,
    updatedAt: Date,

    localAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    },

    skills: [String],

    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
    }],
});

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
