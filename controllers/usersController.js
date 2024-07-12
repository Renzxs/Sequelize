// Imports packages
const sequelize = require("sequelize");
const validator = require("validator");

// Models
const Users = require("../models/Users");

// Get a user
exports.getUsers = async (req, res) => {
    const { searchFullName, getUserByID } = req.query;

    try {
        // Search Query
        if (searchFullName) {
            const getByFullName = await Users.findAll({
                where: {
                    fullname: {
                        [sequelize.Op.like]: `${searchFullName.toLowerCase()}%`
                    }
                }
            });
            return res.json({ message: "Successfully fetched users", result: getByFullName });
        }

        // Get User by ID
        if (getUserByID) {
            const user = await Users.findByPk(getUserByID);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json({ message: "Successfully fetched a user", result: user });
        }

        // Default query (Gets all users)
        const allUsers = await Users.findAll();
        return res.status(200).json({ message: "Successfully retrieved data", result: allUsers });

    } 
    catch (error) {
        // Incase of an error this will be the response.
        console.error("Error in /get-users endpoint:", error);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

// Create a users
exports.createUser = async (req, res) => {
    const { fullname, email, user_role, password } = req.body;

    try {
        if(!fullname || !email || !password || !user_role) {
            // If fullname, email or password empty, this will be the response
            return res.json({"message": "Please do not empty the fullname, email and password.", "success": false});
        }

        if(!validator.isEmail(email)) {
            // Email Validator
            return res.json({"message": "Invalid Email address", "success": false});
        }

        // Create user query
        const createUser = await Users.create({ fullname, email, user_role, password });
        return res.status(201).json({"message": "Successfully Created!", "success": true});
    } 
    catch(error) {
        // Internal server error response
        return res.send(500).json({"message": "Internal Server Error", "success": false});
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        // Get user by id
        const user = await Users.findByPk(id);
        if(!user) { return res.send(404).json({"message": "User not found"}); }

        // Delete a user
        await user.destroy();
        return res.json({"message": "User successfully deleted"});      

    } catch(error) {
        // Internal server error
        return res.send(500).json({"message": "Internal Server Error"});
    }
};

// Edit a user
exports.editUser = async (req, res) => {
    const id = req.params.id;
    const { fullname, email, user_role, password } = req.body;

    try {
        if(!fullname || !email || !password || !user_role){
            // If fullname, email or password is empty, is will be the server response.
            return res.json({"message": "Please do not empty the fullname, email and password", "success": false});
        }

        if(!validator.isEmail(email)) {
            // Email Validator
            return res.json({"message": "Invalid Email address", "success": false});
        }

        // Get user by id query
        const user = await Users.findByPk(id);
        if(!user) { return res.send(404).json({"message": "User not found", "success": false}); }
        
        // Update a user
        await user.update({ fullname, email, user_role, password });
        return res.json({"message": "User successfully updated", "success": true});     

    } catch(error) {
        // Internal server error server response.
        return res.send(500).json({"message": "Internal Server Error", "success": false});
    }
};