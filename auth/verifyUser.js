// auth/verifyUser.js

const jwt = require('jsonwebtoken');
const db = require('../util/db.config');
const User = db.user;

const secretKey = process.env.JWT_SECRET; // ใช้คีย์ที่ปลอดภัยในการสร้างและตรวจสอบ JWT

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // คาดหวัง token อยู่ใน Authorization header ในรูปแบบ Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }

        // ตรวจสอบว่าผู้ใช้มี role ที่เหมาะสมหรือไม่
        const user = await User.findOne({ where: { username: decoded.username } });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.user_status !== 'Approved') {
            return res.status(403).json({ message: 'User not approved' });
        }

        req.user = decoded; // เก็บข้อมูลผู้ใช้ใน request object
        next(); // ทำการเรียกใช้ middleware ถัดไป
    });
};

module.exports = verifyToken;
