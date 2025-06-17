const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    id: Number,
    courseName: String,
    description: String,
    courseDuration: String,
    courseFee: Number,
});
const courseModel = mongoose.model("courses", courseSchema);
module.exports = courseModel;