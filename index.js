// Imports (Dependencies, Packages and etc.)
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");

// Models
const Users = require("./models/Users");

// Initialize Expresss
const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

// Cross-origin resources configuration
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));

// Port configuration
app.listen(process.env.SERVER_PORT, () => {
    try {
        console.log(`Server running on port ${process.env.SERVER_PORT}`);
    }
    catch(error) {
        console.log("Internal Server Error.")
    }
});

// Default server route
app.get('/', (req, res) => {
    try {
        return res.send(200).json({"message": "Successful Request"});
    }
    catch(error) {
        return res.json({"message": "Internal Server Error"});
    }
});

// Get a user
app.get("/get-users", async (req, res) => {
    const { searchFullName } = req.query;

    try {
        // Search bar
        if(searchFullName) {
            const getByFullName = await Users.findAll({
                where:{
                    fullname: {
                        [sequelize.Op.like]: `${searchFullName.toLowerCase()}%`
                    }
                }
            });
            return res.json({message: "Successfully fetched users", result: getByFullName});
        }
        
        // Default data
        const userData = await Users.findAll();
        return res.status(201).json({"message": "Successfully Retrived Data!", result: userData});

    } catch(error) {
        return res.send(500).json({"message": "Internal Server Error"});
    }
});

// Create a user
app.post("/create-user", async (req, res) => {
    const { apiKey } = req.query;
    const { fullname, email, password } = req.body;

    try {
        if(!fullname || !email || !password) {
            return res.json({"message": "Please do not empty the fullname, email and password."});
        }

        const createUser = await Users.create({
            fullname,
            email,
            password
        });

        return res.status(201).json({"message": "Successfully Created!"});

    } catch(error) {
        console.log(error)
        return res.send(500).json({"message": "Internal Server Error"});
    }
});

// Delete a user
app.delete("/delete-user/:id", async (req, res) => {
    const { apiKey } = req.query;
    const id = req.params.id;

    try {
        const user = await Users.findByPk(id);
        if(!user) {
            return res.send(404).json({"message": "User not found"});
        }
        await user.destroy();
        return res.json({"message": "User successfully deleted"});      

    } catch(error) {
        return res.send(500).json({"message": "Internal Server Error"});
    }
});

// Edit a user
app.put("/edit-user/:id", async (req, res) => {
    const { apiKey } = req.query;
    const id = req.params.id;
    const { fullname, email, password } = req.body;

    try {
        if(!fullname || !email || !password){
            return res.status(400).json({"message": "Please do not empty the fullname, email and password"});
        }

        const user = await Users.findByPk(id);
        if(!user) {
            return res.send(404).json({"message": "User not found"});
        }
        
        await user.update({ fullname, email, password });
        return res.json({"message": "User successfully updated"});     

    } catch(error) {
        return res.send(500).json({"message": "Internal Server Error"});
    }
});
