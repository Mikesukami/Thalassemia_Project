var express = require('express');
var router = express.Router();
const db = require('../util/db.config');

// define variable
const sequelize = db.sequelize;
const User = db.user;
const route = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//get all users
router.get('/find/all', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);
  const users = await User.findAll();

  res.send({
    status: 200,
    message: "success",
    data: users
  });

});

//create user
router.post('/create', async (req, res, next) => {
  console.log('body::==', req.body);
  console.log('params::==', req.params);
  const user = req.body;
  let newUser = null;
  if (user) {
    newUser = await sequelize.transaction(function(t) {
  
      return User.create(user, { transaction: t });
    });
  }
  res.json(newUser);
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


module.exports = router;
