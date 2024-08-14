module.exports = (sequelize, Sequelize) => {
    const Media = sequelize.define(
      'media',
      {
        mediaId: {
          type: Sequelize.INTEGER,
          field: 'media_id',
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        userId: {
          type: Sequelize.INTEGER,
          field: 'user_id',
          allowNull: false,
          references: {
            model: 'user', // ชื่อของตารางที่อ้างอิงถึง (user)
            key: 'user_id'
          },
          onDelete: 'CASCADE' // เมื่อผู้ใช้ถูกลบ ให้ลบ media นี้ด้วย
        },
        fileName: {
          type: Sequelize.STRING,
          field: 'file_name',
          allowNull: false
        },
        fileType: {
          type: Sequelize.STRING,
          field: 'file_type',
          allowNull: false
        },
        fileSize: {
          type: Sequelize.INTEGER,
          field: 'file_size',
          allowNull: false
        },
        fileUrl: {
          type: Sequelize.STRING,
          field: 'file_url',
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
        }
      },
      {
        timestamps: true, // เปิดใช้งาน timestamps เพื่อเพิ่ม createdAt และ updatedAt
        freezeTableName: true
      }
    );

    return Media;
  };
