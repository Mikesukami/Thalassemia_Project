-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2024 at 03:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `user_status` varchar(255) NOT NULL DEFAULT 'notApproved'
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
(10007, 'Nanthira', 'Vongvichiankul', 'somehandsomeguy.com', 'Noirennel', '$2b$10$dD6aIbry/FH4eGBa2nzARuvvN25lv.17S1BWyEIkUchLCAFIg9r2i', '2024-08-05 03:18:03', '2024-08-05 03:18:03', 'user', 'notApproved');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10010;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
