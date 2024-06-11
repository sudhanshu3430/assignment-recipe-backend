const express = require('express');

const router = express.Router();

const zod = require("zod");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
 

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

   

    res.json({
        message: "User created successfully",
        token: token,
        userId: userId
    });
});

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });

        // If the user is not found, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

       

        // If passwords match, generate a JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET);

        // Send the token along with success message
        res.json({ message: "User sign in successful", token , userId: user._id});
    } catch (error) {
        // Handle any errors
        console.error("Error while signing in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = router;    
