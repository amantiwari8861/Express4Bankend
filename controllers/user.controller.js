const { generateToken } = require("../middlewares/application/auth.middleware");
const addressModel = require("../model/address.model");
const courseModel = require("../model/course.model");
const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ "email": email });
        if (!user)
            return res.status(404).send("user doesn't exist!");

        if (bcrypt.compareSync(password, user?.password)) {
            const token = generateToken(user.toObject());
            return res.status(200).send({ message: "login succesfully!", token });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
}


// Get all users with populated address and courses
exports.getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find()
            .populate("localAddress")
            .populate("courses");
        res.json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Get user by ID with populated references
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await userModel.findById(id)
            .populate("localAddress")
            .populate("courses");

        if (!user) {
            return res.status(404).send("User not found!");
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const user = await userModel.findOne({ email })
            .populate("localAddress")
            .populate("courses");

        if (!user) {
            return res.status(404).send("User not found!");
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Get user by phone number
exports.getUserByPhone = async (req, res) => {
    const { phone_no } = req.params;

    try {
        const user = await userModel.findOne({ mobileNo: phone_no })
            .populate("localAddress")
            .populate("courses");

        if (!user) {
            return res.status(404).send("User not found!");
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    const user = req.body;

    try {
        // Save address
        const savedAddress = await addressModel.create(user.localAddress);

        // Save each course
        const savedCourses = await Promise.all(
            user.courses.map(course => courseModel.create(course))
        );

        // Set ObjectId references
        user.localAddress = savedAddress._id;
        user.courses = savedCourses.map(course => course._id);
        user.joinedAt = new Date();
        user.updatedAt = new Date();

        user.password = bcrypt.hashSync(user.password, 12);
        // bcrypt.compareSync()

        // Save user
        const insertedUser = await userModel.create(user);

        res.status(201).json({
            message: "User added successfully!",
            data: insertedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const userNewData = req.body;

    try {
        userNewData.updatedAt = new Date();

        const existingUser = await userModel.findById(id);
        // console.log("user existed", existingUser);
        if (!existingUser) {
            return res.status(404).send("User not found!");
        }
        const addressId = existingUser?.localAddress;
        // console.log(addressId);
        const updatedAddress = await addressModel.findByIdAndUpdate(addressId, userNewData?.localAddress, { new: true });
        // console.log("Address Updated! ", updatedAddress);

        delete userNewData?.localAddress;
        delete userNewData?.courses;
        const updatedUser = await userModel.findByIdAndUpdate(id, userNewData, {
            new: true,
        });
        res.json({
            message: "User updated successfully!",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await userModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).send("User not found!");
        }

        res.json({
            message: "User deleted successfully!",
            data: deletedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Something went wrong!");
    }
};
