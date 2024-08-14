-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 14, 2024 at 07:19 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `media`
--

CREATE TABLE `media` (
  `media_id` int NOT NULL,
  `user_id` int NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_size` int NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media`
--

INSERT INTO `media` (`media_id`, `user_id`, `file_name`, `file_type`, `file_size`, `file_url`, `created_at`, `updated_at`) VALUES
(2, 10006, '1723644598818.jpg', 'image/jpeg', 328644, '/uploads/1723644598818.jpg', '2024-08-14 14:09:58', '2024-08-14 14:09:58'),
(3, 10006, 'Teletubbee-14-8-2024.jpg', 'image/jpeg', 27522, 'uploads/Teletubbee-14-8-2024.jpg', '2024-08-14 14:21:00', '2024-08-14 14:21:00'),
(4, 10006, 'memesheft-14-8-2024.png', 'image/png', 1274459, 'uploads/memesheft-14-8-2024.png', '2024-08-14 15:20:17', '2024-08-14 15:20:17'),
(5, 10006, 'Smiling-Cat-14-8-2024.jpg', 'image/jpeg', 40446, 'uploads/Smiling-Cat-14-8-2024.jpg', '2024-08-14 15:26:33', '2024-08-14 15:26:33'),
(6, 10006, 'pao-cat-14-8-2024.jpg', 'image/jpeg', 28030, 'uploads/pao-cat-14-8-2024.jpg', '2024-08-14 15:27:14', '2024-08-14 15:27:14'),
(7, 10006, '0506HbHSmear1-Gloria-Kwon-14-8-2024.jpg', 'image/jpeg', 321494, 'uploads/0506HbHSmear1-Gloria-Kwon-14-8-2024.jpg', '2024-08-14 16:55:53', '2024-08-14 16:55:53'),
(8, 10007, '0506HbHSmear1-Gloria-Kwon-15-8-2024.jpg', 'image/jpeg', 321494, 'uploads/0506HbHSmear1-Gloria-Kwon-15-8-2024.jpg', '2024-08-14 17:55:07', '2024-08-14 17:55:07'),
(9, 10007, 'Talasimia-15-8-2024.jpg', 'image/jpeg', 321494, 'uploads/Talasimia-15-8-2024.jpg', '2024-08-14 18:19:09', '2024-08-14 18:19:09'),
(10, 10006, 'Talasimia-15-8-2024.jpg', 'image/jpeg', 321494, 'uploads/Talasimia-15-8-2024.jpg', '2024-08-14 18:43:32', '2024-08-14 18:43:32');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `role` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'user',
  `user_status` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'notApproved'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `firstname`, `lastname`, `email`, `username`, `password`, `created_at`, `updated_at`, `role`, `user_status`) VALUES
(1, 'Apisit', 'Namsakun', 'apisit@hotmail.com', 'apisit_97', 'ApiSit789', '2024-08-03 07:07:54', '2024-08-03 07:07:54', 'user', 'notApproved'),
(2, 'Lena', 'Williams', 'lena.williams@example.com', 'lena_w', 'LenaW123!', '2024-08-03 07:09:50', '2024-08-03 07:09:50', 'user', 'notApproved'),
(3, 'Carlos', 'Mendez', 'carlos.mendez@example.com', 'carlos_m', 'CarlosM987#', '2024-08-03 07:10:12', '2024-08-03 07:10:12', 'user', 'notApproved'),
(4, 'Sofia', 'Nguyen', 'sofia.nguyen@example.com', 'sofia_n', 'SofiaN456$', '2024-08-03 07:22:40', '2024-08-03 07:22:40', 'user', 'notApproved'),
(10001, 'สุพัตรา', 'บัวทอง', 'supattra.buathong@example.com', 'supattra_b', 'Supattra1234!', '2024-08-03 07:34:23', '2024-08-03 07:34:23', 'user', 'notApproved'),
(10002, 'นันท์ธีรา', 'วงศ์วิเชียรกุล', 'nanthira@gmail.com', 'Nanthira', '123456', '2024-08-03 09:36:17', '2024-08-03 09:36:17', 'user', 'Approved'),
(10003, 'เนตร', 'จิต', 'natnapa341@gmail.com', 'nnp', '140146', '2024-08-03 09:39:04', '2024-08-03 09:39:04', 'user', 'notApproved'),
(10004, 'สมชาย', 'ชอบมาก', 'somchai@gmail.com', 'somchai', '123456', '2024-08-03 09:49:13', '2024-08-03 09:49:13', 'user', 'notApproved'),
(10006, 'test', 'lastname', 'test@gmail.com', 'patiparn', '$2b$10$B2KrvZO7zJF2Jr6DvAvoceoUL7OIRk9DdjKdmXtcRdGlN5UjVt1pu', '2024-08-03 10:25:51', '2024-08-03 10:25:51', 'user', 'Approved'),
(10007, 'Nanthira', 'Vongvichiankul', 'somehandsomeguy.com', 'Noirennel', '$2b$10$dD6aIbry/FH4eGBa2nzARuvvN25lv.17S1BWyEIkUchLCAFIg9r2i', '2024-08-05 03:18:03', '2024-08-05 03:18:03', 'user', 'Approved'),
(10016, 'Test', '01', 'test01@gmail.com', 'test', '$2b$10$sY.kCX7xlEV1YgD/YFjqoeyewmk6JtLXUFLHMuQuX1lrBbmmD4Z12', '2024-08-11 04:03:49', '2024-08-11 04:03:49', 'user', 'Approved'),
(10017, 'Karn', 'Sommanuswanid', 'Karn@gmail.com', 'karn', '$2b$10$Ebe3sUEYJ2.vjnp/MuP5jOab7bl4DCATNQZY/4p6ZM8dcH5gVcN9i', '2024-08-11 04:37:05', '2024-08-11 04:37:05', 'user', 'notApproved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `media`
--
ALTER TABLE `media`
  ADD PRIMARY KEY (`media_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_4` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `media`
--
ALTER TABLE `media`
  MODIFY `media_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10018;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `media`
--
ALTER TABLE `media`
  ADD CONSTRAINT `media_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
