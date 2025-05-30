const joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');
const ownerModel = require('../Model/ownerModel');

async function registerUser(req, res) {
    const registerSchema = joi.object({
        fullname: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    const { error, value } = registerSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    const { fullname, email, password } = value;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

async function loginUser(req, res) {
    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    const { error, value } = loginSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(detail => detail.message) });
    }

    const { email, password } = value;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

// logout
async function logout(req, res) {
    try {
        res.clearCookie('token'); 
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ error: "Server error" });
    }
}


const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await userModel.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Register owner
async function registerOwner(req, res) {
    const schema = joi.object({
        fullname: joi.string().min(3).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message) });
    }

    const { fullname, email, password } = value;

    try {
        const existingOwner = await ownerModel.findOne({ email });
        if (existingOwner) {
            return res.status(409).json({ error: "Owner already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newOwner = await ownerModel.create({
            fullname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: newOwner._id, email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '2h'
        });

        res.status(201).json({
            message: "Owner registered successfully",
            token,
            owner: {
                id: newOwner._id,
                fullname: newOwner.fullname,
                email: newOwner.email
            }
        });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

// Login owner
async function loginOwner(req, res) {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details.map(d => d.message) });
    }

    const { email, password } = value;

    try {
        const owner = await ownerModel.findOne({ email });
        if (!owner) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, owner.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: owner._id, email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '2h'
        });

        res.status(200).json({
            message: "Login successful",
            token,
            owner: {
                id: owner._id,
                fullname: owner.fullname,
                email: owner.email
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports = {registerUser,loginUser, logout, getUserById, registerOwner, loginOwner}