const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateAdmin } = require("../middleware/validationMiddleware");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const User = require("../models/authModels");

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.ID_utilisateur, role: user.role_user }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const register = async (req, res) => {
    const { pseudo, email, password } = req.body;
    try {
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.createUser(pseudo, email, hashedPassword, 2);
        const token = jwt.sign({ id: newUser.ID_utilisateur, role: 2 }, JWT_SECRET, { expiresIn: "1h" });
        res.status(201).json({ token });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const createUser = async (req, res) => {
    const { pseudo, email, password } = req.body;
    try {
        if (validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.createUser(pseudo, email, hashedPassword, 2);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req, res) => {
    const { id, pseudo, email, password, role } = req.body;
    try {
        if (validateAdmin(req.user) && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await User.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
        await User.updateUser(id, pseudo, email, hashedPassword, role );
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.body;
    try {
        if (validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await User.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await User.deleteUser(id);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUser = async (req, res) => {
    const { id } = req.body;
    try {
        if (validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const user = await User.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        if (validateAdmin(req.user)) {
            return res.status(403).json({ message: "Access denied" });
        }
        const users = await User.findAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    login,
    register,
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers
};
