const express = require('express');
const multer = require('multer');
const db = require('../util/db.config');
const path = require('path');
const moment = require('moment');

const router = express.Router();
const Media = db.media;
const User = db.user;

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


router.post('/upload-multiple', upload.array('images'), async (req, res) => {
  try {
    const userId = req.body.userId; // รับ userId จาก body
    const uploadedFiles = req.files; // รับไฟล์ที่ถูกอัปโหลด

    // ตรวจสอบว่ามี userId ถูกส่งมา
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const user = await User.findByPk(userId);  // ตรวจสอบในฐานข้อมูลโดยใช้ userId
    if (!user) {
      return res.status(404).json({ error: "User not found" });  // หากไม่พบ user
    }

    // ดำเนินการสร้างข้อมูลไฟล์ที่ถูกอัปโหลด
    const mediaEntries = uploadedFiles.map(file => ({
      userId: userId,
      fileName: file.filename,
      fileType: file.mimetype,
      fileSize: file.size,
      fileUrl: `uploads/${file.filename}` // สร้าง URL สำหรับไฟล์ที่อัปโหลด
    }));

    // สร้าง entries ใน database
    await Media.bulkCreate(mediaEntries);

    // ส่งกลับเมื่อทำงานสำเร็จ
    return res.status(200).json({
      status: 200,
      message: "Images uploaded successfully!"
    });
  } catch (error) {
    console.error('Error during images upload:', error);
    return res.status(500).json({ error: "An error occurred while uploading the images" });
  }
});

router.post('/get-images-by-user', async (req, res) => {
  try {
    const userId = req.body.userId; // รับ userId จาก body

    // ตรวจสอบว่ามี userId ถูกส่งมา
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่หรือไม่
    const user = await User.findByPk(userId);  // ค้นหาผู้ใช้จากฐานข้อมูล
    if (!user) {
      return res.status(404).json({ error: "User not found" });  // หากไม่พบ user
    }

    // ดึงข้อมูลรูปภาพทั้งหมดตาม userId
    const images = await Media.findAll({
      where: { userId: userId }
    });

    // ตรวจสอบว่าพบรูปภาพหรือไม่
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found for this user" });
    }

    // ส่งข้อมูลรูปภาพกลับไป
    return res.status(200).json({
      status: 200,
      message: "Images retrieved successfully!",
      data: images
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    return res.status(500).json({ error: "An error occurred while retrieving images" });
  }
});

module.exports = router;
