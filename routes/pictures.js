const express = require('express');
const multer = require('multer');
const db = require('../util/db.config');
const path = require('path');
const moment = require('moment');

const router = express.Router();
const Media = db.media;

// การตั้งค่า multer สำหรับการจัดการไฟล์ที่อัปโหลด
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // เป้าหมายที่ต้องการเก็บไฟล์
  },
  filename: (req, file, cb) => {
    // สร้างชื่อไฟล์ใหม่ที่ประกอบด้วยชื่อไฟล์เดิม + วันที่
    const originalName = path.parse(file.originalname).name; // ชื่อไฟล์เดิม
    const fileExt = path.extname(file.originalname); // นามสกุลไฟล์
    const date = moment().format('D-M-YYYY'); // วันที่ในรูปแบบที่ต้องการ
    const newFileName = `${originalName}-${date}${fileExt}`; // สร้างชื่อไฟล์ใหม่
    cb(null, newFileName); // ใช้ชื่อไฟล์ใหม่
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId; // รับ userId จาก body
    const fileName = req.file.filename;
    const fileType = req.file.mimetype;
    const fileSize = req.file.size;
    const fileUrl = `uploads/${fileName}`; // สร้าง URL สำหรับไฟล์ที่อัปโหลด

    // สร้าง entry ใน database
    await Media.create({
      userId: userId,
      fileName: fileName,
      fileType: fileType,
      fileSize: fileSize,
      fileUrl: fileUrl
    });

    return res.status(200).json({
      status: 200,
      message: "Image uploaded successfully!"
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    return res.status(500).json({ error: "An error occurred while uploading the image" });
  }
});

module.exports = router;
