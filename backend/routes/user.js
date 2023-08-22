const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/signup", userController.createUser);
router.post("/login", userController.userLogin);
router.get("/users", userController.getUserLists);
router.get("/users/:id", userController.getUserById); // New route for fetching a particular user

module.exports = router;
