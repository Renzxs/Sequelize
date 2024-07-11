// Imports (Dependencies, Packages and etc.)
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

// Routes
const router = require('./routes');

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
        // Success server access
        return res.send(200).json({"message": "Successful Request"});
    }
    catch(error) {
        // Failed server access
        return res.json({"message": "Internal Server Error"});
    }
});

// Routes
app.use("/user", router);
