const jwt = require("jsonwebtoken");
const userModel = require("../Model/userModel"); 

const isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Optionally fetch user info (you can skip this if you already have it in token)
        const user = await userModel.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = { isLoggedIn };
