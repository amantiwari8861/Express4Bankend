const { register, getAllUsers, getUserById, getUserByEmail, getUserByPhone, addUser, updateUser, deleteUser, login } = require("../controllers/user.controller");
const { authMiddleware } = require("../middlewares/application/auth.middleware");

const router = require("express").Router();

router.get("/greet", (req, res) => {
    res.send("Good Morning Everyone!");
});
router.post("/", addUser);
router.post("/login", login);
router.use(authMiddleware);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.get("/email/:email", getUserByEmail);
router.get("/phone/:phone_no", getUserByPhone);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

exports.userRoutes = router;