var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../util/db.config');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure dotenv is loaded
const verifyToken = require('../auth/verifyUser');
const authUserToken = require('../functions/authUserToken');

// define variable
const sequelize = db.sequelize;
const User = db.user;
const route = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//get all users
router.get('/find/all', verifyToken, async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);

  try {
    const users = await User.findAll({
      attributes: ['user_id','firstname', 'lastname', 'email', 'role', 'user_status'] // เลือกเฉพาะฟิลด์ที่ต้องการ
    });

    res.send({
      status: 200,
      message: "success",
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

//create user
router.post('/create', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);
  const user = req.body;
  let newUser = null;
  if (user) {
    try {
      // เข้ารหัสรหัสผ่านก่อนบันทึก
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;

      newUser = await sequelize.transaction(function(t) {
        return User.create(user, { transaction: t });
      });

      res.json({
        status: 200,
        message: "User created successfully",
        data: newUser
      });

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'An error occurred while creating the user' });
    }
  } else {
    res.status(400).json({ error: 'Invalid user data' });
  }
});

//update user
// update user
router.put('/update', async (req, res, next) => {
  const user = req.body;

  if (!user.userId) {
    return res.status(400).json({ error: 'userId is required for updating user' });
  }

  //check user exist
  const userExist = await User.findOne({ where: { userId: user.userId } });
  if (!userExist) {
    return res.status(400).json({ error: 'User not found' });
  }

  try {
    const updatedUser = await sequelize.transaction(async (t) => {
      const [rowsUpdate, updatedUsers] = await User.update(user, {
        where: { userId: user.userId },
        returning: true,
        transaction: t
      });

      if (rowsUpdate === 0) {
        res.send({
          status: 400,
          message: "User not found"
        });
      }

      // คืนค่าผู้ใช้ที่ถูกอัปเดต
      return updatedUsers[0]; // ใช้ updatedUsers[0] เพื่อดึงข้อมูลผู้ใช้ตัวแรก
    });

    // ส่งข้อมูลผู้ใช้ที่อัปเดตกลับไป
    return res.status(200).json({
      result: "success",
      code: 200,
      message: "User updated successfully",
      data: updatedUser
    });
  
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});

//delete user
router.delete('/delete/', async (req, res, next) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required for deleting user' });
  }

  //check user exist
  const userExist = await User.findOne({ where: { userId: userId } });
  if (!userExist) {
    return res.status(400).json({ error: 'User not found' });
  }

  try {
    await sequelize.transaction(async (t) => {
      const rowsDelete = await User.destroy({
        where: { userId: userId },
        transaction: t
      });

      if (rowsDelete === 0) {
        res.send({
          status: 400,
          message: "User not found"
        });
      }

      // ส่งข้อความกลับไป
      return res.status(200).json({
        result: "success",
        code: 200,
        message: "User deleted successfully"
      });
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
});

// login user
router.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (user.user_status !== 'Approved') {
            return res.status(403).json({ error: 'User not approved' });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.userId,
                username: user.username,
                role: user.role, // Assuming you have a role field in your user model
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expiration time
        );

        return res.status(200).json({
            status: 'approved',
            token: token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

router.get('/get_user_data', verifyToken, async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  
  try {
      const userData = await authUserToken(token);

      return res.status(200).json({
          status: 200,
          message: "Get user data success!",
          data: {
              userId: userData.userId,
              username: userData.username,
              firstname: userData.firstname,
              lastname: userData.lastname,
              role: userData.role,
          }
      });
  } catch (error) {
      console.error('Error fetching user data:', error);
      return res.status(500).json({ error: error.message });
  }
});

// Approve user
router.put('/approve', verifyToken, async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required for approving user' });
  }

  try {
    const user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // อัปเดตสถานะเป็น Approved
    user.user_status = 'Approved';

    await user.save();

    return res.status(200).json({
      result: "success",
      code: 200,
      message: "User approved successfully",
      data: user
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'An error occurred while approving the user' });
  }
});

// Change user role
router.put('/change-role', verifyToken, async (req, res, next) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res.status(400).json({ error: 'userId and newRole are required for changing role' });
  }

  try {
    const user = await User.findOne({ where: { userId: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // อัปเดตบทบาทของผู้ใช้
    user.role = newRole;

    await user.save();

    return res.status(200).json({
      result: "success",
      code: 200,
      message: "User role updated successfully",
      data: user
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'An error occurred while updating the user role' });
  }
});



module.exports = router;
