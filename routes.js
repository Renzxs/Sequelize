// Imports packages
const express = require("express");
const router = express.Router();

// Controllers
const usersController = require('./controllers/usersController');

// Users Controllers
router.get("/get-users", usersController.getUsers);
router.post("/create-user", usersController.createUser);
router.delete("/delete-user/:id", usersController.deleteUser);
router.put("/edit-user/:id", usersController.editUser);

module.exports = router;