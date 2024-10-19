const jwt = require('jsonwebtoken');
const db = require('../util/db.config'); // Adjust the path if necessary

const User = db.user;

const authUserToken = async (token) => {
    if (!token) {
        throw new Error('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Find the user in the database
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            throw new Error('User not found');
        }

        return {
            userId: user.userId,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
        };
    } catch (error) {
        throw new Error('Failed to authenticate token');
    }
};

module.exports = authUserToken;
