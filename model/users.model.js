module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
      'user',
      {
        userId: {
          type: Sequelize.INTEGER,
          field: 'user_id',
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        firstname: {
          type: Sequelize.STRING,
          field: 'firstname',
          allowNull: false
        },
        lastname: {
          type: Sequelize.STRING,
          field: 'lastname',
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          field: 'email',
          allowNull: false,
          unique: true
        },
        username: {
          type: Sequelize.STRING,
          field: 'username',
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          field: 'password',
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at',
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at',
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        role: {
          type: Sequelize.STRING,
          field: 'role',
          allowNull: false,
          defaultValue: 'user'
        },
        user_status: {
          type: Sequelize.STRING,
          field: 'user_status',
          allowNull: false,
          defaultValue: 'notApproved'
        }
        // stat: {
        //   type: sequelize.STRING,
        //   field: 'status',
        //   allowNull: false,
        //   defaultValue: 'notApproved'
        // }
      },
      {
        timestamps: true, // เปิดใช้งาน timestamps เพื่อเพิ่ม createdAt และ updatedAt
        freezeTableName: true
      }
    );
  
    // หลังจากสร้างตารางแล้ว ให้ตั้งค่า AUTO_INCREMENT
    // User.sync({ alter: true }).then(() => {
    //   sequelize.query('ALTER TABLE user AUTO_INCREMENT = 10001;')
    //     .then(() => {
    //       console.log('AUTO_INCREMENT value set to 10001');
    //     })
    //     .catch((err) => console.error('Error setting initial AUTO_INCREMENT value:', err));
    // }).catch((err) => console.error('Error synchronizing database:', err));
  
    return User;
  };
  
  


// const { user } = require("../util/db.config");

// module.exports = (sequelize, Sequelize) => {
//     const User = sequelize.define(
//       'user',
//       {
//         userId: {
//           type: Sequelize.INTEGER,
//           field: '_id',
//           primaryKey: true
//         },
//         firstname: {
//           type: Sequelize.STRING,
//           field: 'fisrtname'
//         },
//         lastname: {
//           type: Sequelize.STRING,
//           field: 'lastname'
//         },
//         email: {
//           type: Sequelize.STRING,
//           field: 'email'
//         },
//         username: {
//           type: Sequelize.STRING,
//           field: 'username'
//         },
//         password: {
//           type: Sequelize.STRING,
//           field: 'password'
//         },
//       },
//       {
//         timestamps: false,
//         freezeTableName: true
//       }
//     );
//     return User;
//   };