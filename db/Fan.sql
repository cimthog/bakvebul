-- Adminer 4.7.0 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `admin` (`id`, `email`, `password`) VALUES
(1,	'admin@gmail.com',	'123456');

DROP TABLE IF EXISTS `api_keys`;
CREATE TABLE `api_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `api_name` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `api_key_1` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `api_key_2` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `api_key_3` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `api_key_4` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `api_keys` (`id`, `api_name`, `api_key_1`, `api_key_2`, `api_key_3`, `api_key_4`) VALUES
(1,	'Mailgun',	'ef5924af46ea9c61c8e31f5c006ada8b-65b08458-d9013671',	'mg.live2talks.com',	'NA',	'NA');

DROP TABLE IF EXISTS `apply_job`;
CREATE TABLE `apply_job` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artist_pub_id` text NOT NULL,
  `job_id` text NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0 = pending, 1 = confirm , 2 = complete, 3 =reject ,4=delete by user 5. in process',
  `created_at` varchar(200) NOT NULL,
  `updated_at` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `apply_job` (`id`, `artist_pub_id`, `job_id`, `status`, `created_at`, `updated_at`) VALUES
(77,	'2KM3X00IUUKEB1ENOV',	'wtm7jpuj',	2,	'1598427343987',	'1598427343987'),
(78,	'2KM3X009JRKE4CWAKD',	'wtm7jpuj',	3,	'1598427526996',	'1598427526996'),
(79,	'2KM3X009JRKE4CUICO',	'53ui6rlq',	2,	'1598428683993',	'1598428683993'),
(80,	'2KM3X00IUUKEB1ENOV',	'f88har9k',	2,	'1598429416910',	'1598429416910'),
(81,	'2KM3X00IUUKEB1ENOV',	'437ndo67',	2,	'1598429685055',	'1598429685055'),
(82,	'2KM3X00IUUKEB1ENOV',	'aphxwobv',	2,	'1598429872350',	'1598429872350'),
(83,	'2KM3X00IUUKEB1ENOV',	'fj3xbc9f',	2,	'1598430192235',	'1598430192235'),
(84,	'2KM3X00IUUKEB1ENOV',	'4l1pksqp',	2,	'1598430275488',	'1598430275488'),
(85,	'2KM3X009JRKE4CUICO',	'5ntfw0n4',	2,	'1598431010180',	'1598431010180'),
(86,	'2KM3X009JRKE4CUICO',	'z8zj23c7',	2,	'1598431162403',	'1598431162403'),
(87,	'2KM3X009JRKE4CUICO',	'1nzbnklp',	2,	'1598433009488',	'1598433009488'),
(88,	'2KM3X009JRKE4CWAKD',	'fmvnvchi',	2,	'1598433582007',	'1598433582007'),
(89,	'2KM3X009JRKE4CUICO',	'qdcqiw9p',	2,	'1598433645925',	'1598433645925'),
(90,	'2KM3X009JRKE4CUICO',	'ckbc02vr',	2,	'1598434262888',	'1598434262888'),
(91,	'2KM3X009JRKE4CUICO',	'kl7z8vs3',	3,	'1598434312116',	'1598434312116'),
(92,	'2KM3X009JRKE4CUICO',	'3vf8oiyy',	3,	'1598434357798',	'1598434357798'),
(93,	'2KM3X00IUUKEB1ENOV',	'kl7z8vs3',	2,	'1598435673256',	'1598435673256'),
(94,	'2KM3X00IUUKEB1ENOV',	'3vf8oiyy',	0,	'1598435841641',	'1598435841641'),
(95,	'2KM3X009JRKE4CUICO',	'0dfs9ke2',	0,	'1598436087018',	'1598436087018'),
(96,	'2KM3X009JRKE4CUICO',	'u4d9exq6',	2,	'1598436193607',	'1598436193607');

DROP TABLE IF EXISTS `bank_details`;
CREATE TABLE `bank_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `bank_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `branch_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `account_number` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `ifsc_code` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `swift_code` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `status` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `created_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `updated_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `bank_details` (`id`, `user_pub_id`, `name`, `bank_name`, `branch_name`, `account_number`, `ifsc_code`, `swift_code`, `status`, `created_at`, `updated_at`) VALUES
(1,	'2KM3X009JRKE4CUICO',	'Varun Verma',	'Axis',	'Khandwa Naka Indore',	'91091000000678',	'UTBI5678',	'',	'',	'1598429510016',	'');

DROP TABLE IF EXISTS `booking_invoice1`;
CREATE TABLE `booking_invoice1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) NOT NULL,
  `artist_pub_id` varchar(100) NOT NULL,
  `payment_status` int NOT NULL DEFAULT '2' COMMENT '0.fail 1 success 2.no action',
  `final_amount` double NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '0' COMMENT '0 pending 1.paid',
  `updated_at` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `payment_type` int NOT NULL DEFAULT '1' COMMENT '1.case 2.wallet 0.Online',
  `job_id` varchar(200) NOT NULL,
  `invoice_id` varchar(200) NOT NULL,
  `coupon_id` int NOT NULL DEFAULT '0',
  `net_amount` double NOT NULL,
  `coupon_code` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `discount_type` int NOT NULL DEFAULT '0' COMMENT '0.NA 1.percentage 2.flat cost',
  `discount_fig` double NOT NULL DEFAULT '0',
  `discount_amt` double NOT NULL DEFAULT '0',
  `tax` double NOT NULL DEFAULT '0',
  `currency_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `booking_invoice1` (`id`, `user_pub_id`, `artist_pub_id`, `payment_status`, `final_amount`, `status`, `updated_at`, `created_at`, `payment_type`, `job_id`, `invoice_id`, `coupon_id`, `net_amount`, `coupon_code`, `discount_type`, `discount_fig`, `discount_amt`, `tax`, `currency_id`) VALUES
(31,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	100,	1,	'1598427594868',	'1598427594868',	1,	'wtm7jpuj',	'0ERES8BF',	0,	100,	'',	0,	0,	0,	0,	'1'),
(32,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	100,	1,	'1598428701134',	'1598428701134',	1,	'53ui6rlq',	'AJEGMCDC',	0,	100,	'',	0,	0,	0,	0,	'1'),
(33,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	250,	1,	'1598429495451',	'1598429495451',	1,	'f88har9k',	'NQQNLLAP',	0,	250,	'',	0,	0,	0,	0,	'1'),
(34,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	100,	0,	'1598429760087',	'1598429760087',	1,	'437ndo67',	'OZLM5PLL',	0,	100,	'',	0,	0,	0,	0,	'1'),
(35,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	100,	1,	'1598429903108',	'1598429903108',	1,	'aphxwobv',	'TYP7OLHU',	0,	100,	'',	0,	0,	0,	0,	'2'),
(36,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	15,	1,	'1598430247210',	'1598430247210',	1,	'fj3xbc9f',	'WAY38WKZ',	0,	15,	'',	0,	0,	0,	0,	'2'),
(37,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	2,	42,	1,	'1598430298736',	'1598430298736',	1,	'4l1pksqp',	'FCYSQIQ3',	0,	42,	'',	0,	0,	0,	0,	'1'),
(38,	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	2,	50,	1,	'1598431037790',	'1598431037790',	1,	'5ntfw0n4',	'OB3QLR0V',	0,	50,	'',	0,	0,	0,	0,	'2'),
(39,	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	2,	100,	1,	'1598431182267',	'1598431182267',	1,	'z8zj23c7',	'C92RQVIK',	0,	100,	'',	0,	0,	0,	0,	'1'),
(40,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	25,	0,	'1598433520068',	'1598433520068',	1,	'1nzbnklp',	'40DGU1S4',	0,	25,	'',	0,	0,	0,	0,	'1'),
(41,	'2KM3X009JRKE4CUICO',	'2KM3X009JRKE4CWAKD',	2,	100,	0,	'1598433613548',	'1598433613548',	1,	'fmvnvchi',	'7SDRU0O0',	0,	100,	'',	0,	0,	0,	0,	'2'),
(42,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	100,	0,	'1598433673941',	'1598433673941',	1,	'qdcqiw9p',	'NCT8YN56',	0,	100,	'',	0,	0,	0,	0,	'1'),
(43,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	100,	0,	'1598434283640',	'1598434283640',	1,	'qdcqiw9p',	'Y6VHRUKW',	0,	100,	'',	0,	0,	0,	0,	'1'),
(44,	'2KM3X009JRKE4CWAKD',	'2KM3X00IUUKEB1ENOV',	2,	100,	0,	'1598435759729',	'1598435759729',	1,	'kl7z8vs3',	'7HCZT5WA',	0,	100,	'',	0,	0,	0,	0,	'1'),
(45,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	100,	0,	'1598437556402',	'1598437556402',	1,	'ckbc02vr',	'V1QPIN07',	0,	100,	'',	0,	0,	0,	0,	'1'),
(46,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	2,	51,	0,	'1598437571126',	'1598437571126',	1,	'u4d9exq6',	'O9BKPFXE',	0,	51,	'',	0,	0,	0,	0,	'1');

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `cat_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `price` varchar(200) NOT NULL DEFAULT 'NA',
  `image` varchar(255) NOT NULL DEFAULT 'NA' COMMENT 'img url',
  `status` int NOT NULL DEFAULT '1' COMMENT '1 active ,2 deactive',
  `created_at` varchar(200) NOT NULL DEFAULT 'NA',
  `updated_at` varchar(200) NOT NULL DEFAULT 'NA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `categories` (`id`, `language`, `cat_name`, `price`, `image`, `status`, `created_at`, `updated_at`) VALUES
(1,	'1',	'Driver',	'NA',	'Rojgar/images/image-1592908846514.png',	1,	'NA',	'NA'),
(2,	'1',	'Wedding Planner',	'NA',	'Rojgar/images/image-1592908900293.png',	1,	'NA',	'NA'),
(3,	'1',	'Flowrist',	'NA',	'Rojgar/images/image-1592908993561.png',	1,	'NA',	'NA'),
(4,	'1',	'Makup Artist',	'NA',	'Rojgar/images/image-1592909059231.png',	1,	'NA',	'NA'),
(5,	'1',	'Photographer',	'NA',	'Rojgar/images/image-1592909093640.png',	1,	'NA',	'NA');

DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `thread_id` varchar(100) NOT NULL,
  `message` varchar(2555) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '',
  `user_pub_id` varchar(100) NOT NULL,
  `artist_pub_id` varchar(100) NOT NULL,
  `send_at` varchar(100) NOT NULL,
  `chat_type` tinyint NOT NULL DEFAULT '1' COMMENT '1. text 2.image',
  `is_read_user` tinyint NOT NULL DEFAULT '0' COMMENT '0. Not Read 1. Read',
  `is_read_artist` tinyint NOT NULL DEFAULT '0' COMMENT '0. Not Read 1. Read',
  `image` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'NA',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


SET NAMES utf8mb4;

DROP TABLE IF EXISTS `chat_new`;
CREATE TABLE `chat_new` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_user_id` varchar(50) NOT NULL,
  `receiver_user_id` varchar(50) NOT NULL,
  `message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` varchar(255) NOT NULL,
  `media` varchar(255) DEFAULT NULL,
  `chat_type` varchar(50) NOT NULL DEFAULT '1' COMMENT '1. Text 2. Image 3. Calling 4. snap 5. location',
  `chat_state` varchar(5) NOT NULL DEFAULT '0' COMMENT 'o sent , 1 delivered, 2 read',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `coupon`;
CREATE TABLE `coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `coupon_code` varchar(200) NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `discount_type` int NOT NULL COMMENT '1.percentage 2.flat cost',
  `discount` varchar(10) NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0.Draft,1.published,2.unpublished,3.expired,',
  `updated_at` varchar(255) NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `counter` int NOT NULL DEFAULT '0',
  `coupon_type` varchar(255) NOT NULL DEFAULT '0' COMMENT '0. public 1. private',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `coupon` (`id`, `language`, `coupon_code`, `description`, `discount_type`, `discount`, `status`, `updated_at`, `created_at`, `counter`, `coupon_type`) VALUES
(1,	'1',	'abc123',	'ABC Edit',	2,	'100',	0,	'1589611577534',	'1589611577534',	0,	'0'),
(2,	'1',	'TEST',	'Get 20% Discount ',	1,	'20',	0,	'1590182924711',	'1590182924711',	0,	'0');

DROP TABLE IF EXISTS `currency_setting`;
CREATE TABLE `currency_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `currency_symbol` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `currency_name` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `country_code` varchar(100) NOT NULL,
  `status` int NOT NULL COMMENT '0 Active 2.deactive',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `currency_setting` (`id`, `currency_symbol`, `currency_name`, `code`, `country_code`, `status`) VALUES
(1,	'₹',	'INR',	'INR',	'91',	1),
(2,	'$',	'US Dollar',	'USD',	'1',	1);

DROP TABLE IF EXISTS `favourite`;
CREATE TABLE `favourite` (
  `fav_id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(25) NOT NULL,
  `target_id` varchar(255) NOT NULL,
  `fav_type` int NOT NULL DEFAULT '0' COMMENT '0.job_id,1.user_pub_id',
  `status` int NOT NULL DEFAULT '1' COMMENT '1.fav,0.unFav',
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  PRIMARY KEY (`fav_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `favourite` (`fav_id`, `user_pub_id`, `target_id`, `fav_type`, `status`, `created_at`, `updated_at`) VALUES
(17,	'2KM3X00IUUKEB1ENOV',	'wtm7jpuj',	0,	1,	'1598427228120',	'1598427228120'),
(18,	'2KM3X009JRKE4CWAKD',	'wtm7jpuj',	0,	1,	'1598427480769',	'1598427480769');

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` text NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` varchar(200) NOT NULL,
  `updated_at` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `home_slider`;
CREATE TABLE `home_slider` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `image` varchar(255) NOT NULL,
  `title` varchar(200) CHARACTER SET utf8 NOT NULL,
  `heading` varchar(200) CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `web_url` varchar(255) CHARACTER SET utf8 NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `home_slider` (`id`, `language`, `image`, `title`, `heading`, `description`, `web_url`, `status`) VALUES
(1,	'1',	'Rojgar/images/image-1592912266003.jpg',	'Banner 1',	'Hiring professionals is easy',	'Now search professionals you need, chat with them, and hire them with ease. ',	'http://149.28.139.5/Rojgar/images/image-1592912266003.jpg',	1),
(2,	'1',	'Rojgar/images/image-1593081965848.png',	'banner 2',	'Hiring professionals is easy',	'Now search professionals you need, chat with them, and hire them with ease. ',	'#',	1);

DROP TABLE IF EXISTS `language`;
CREATE TABLE `language` (
  `id` int NOT NULL AUTO_INCREMENT,
  `language` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `language_code` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `language` (`id`, `language`, `language_code`, `status`, `created_at`) VALUES
(1,	'English',	'en',	1,	'1597900727179'),
(2,	'Hindi',	'hi',	1,	'1597903923010'),
(3,	'Marathi',	'mr',	1,	'1597903956602');

DROP TABLE IF EXISTS `multiple_category`;
CREATE TABLE `multiple_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) NOT NULL,
  `cat_id` varchar(100) NOT NULL,
  `created_at` varchar(50) NOT NULL DEFAULT '0',
  `updated_at` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `multiple_category` (`id`, `user_pub_id`, `cat_id`, `created_at`, `updated_at`) VALUES
(272,	'2KM3X00DDBKE4FLVJA',	'1',	'0',	'0'),
(273,	'2KM3X00DDBKE4FLVJA',	'2',	'0',	'0'),
(274,	'2KM3X00DDBKE4FLVJA',	'3',	'0',	'0'),
(275,	'2KM3X00DDBKE4FLVJA',	'5',	'0',	'0'),
(286,	'2KM3X009JRKE4CUICO',	'1',	'0',	'0'),
(287,	'2KM3X009JRKE4CUICO',	'2',	'0',	'0'),
(288,	'2KM3X009JRKE4CUICO',	'3',	'0',	'0'),
(289,	'2KM3X009JRKE4CUICO',	'4',	'0',	'0'),
(290,	'2KM3X009JRKE4CUICO',	'5',	'0',	'0'),
(291,	'2KM3X00M1CKE9X3VZX',	'2',	'0',	'0'),
(292,	'2KM3X009JRKE4CWAKD',	'4',	'0',	'0'),
(293,	'2KM3X009JRKE4CWAKD',	'5',	'0',	'0'),
(294,	'2KM3X002BJKE5H2M9C',	'3',	'0',	'0'),
(295,	'2KM3X002BJKE5H2M9C',	'5',	'0',	'0'),
(296,	'2KM3X00IUUKEB1ENOV',	'1',	'0',	'0');

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) NOT NULL,
  `title` text CHARACTER SET utf8 NOT NULL,
  `type` varchar(200) NOT NULL DEFAULT 'indivisual',
  `msg` text CHARACTER SET utf8 NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `is_read` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `notification` (`id`, `user_pub_id`, `title`, `type`, `msg`, `created_at`, `is_read`) VALUES
(253,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598427343994',	0),
(254,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598427527002',	0),
(255,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598427552464',	0),
(256,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598427559229',	0),
(257,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598427594871',	0),
(258,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598427798261',	0),
(259,	'2KM3X00IUUKEB1ENOV',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598427933087',	0),
(260,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598427939631',	0),
(261,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598428683997',	0),
(262,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598428693837',	0),
(263,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598428701142',	0),
(264,	'2KM3X009JRKE4CUICO',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598428711915',	0),
(265,	'2KM3X009JRKE4CUICO',	'Rating.',	'10012',	'Someone gives you rating.',	'1598428716073',	0),
(266,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598429416915',	0),
(267,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598429441662',	0),
(268,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598429495455',	0),
(269,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598429528398',	0),
(270,	'2KM3X00IUUKEB1ENOV',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598429530282',	0),
(271,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598429534001',	0),
(272,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598429685060',	0),
(273,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598429729130',	0),
(274,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598429737975',	0),
(275,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598429760093',	0),
(276,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598429872358',	0),
(277,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598429884500',	0),
(278,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598429894446',	0),
(279,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598429903112',	0),
(280,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598429925183',	0),
(281,	'2KM3X00IUUKEB1ENOV',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598429955359',	0),
(282,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598429959317',	0),
(283,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598430192241',	0),
(284,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598430201970',	0),
(285,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598430219967',	0),
(286,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598430247228',	0),
(287,	'2KM3X00IUUKEB1ENOV',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598430253685',	0),
(288,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598430258253',	0),
(289,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598430259669',	0),
(290,	'2KM3X009JRKE4CUICO',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598430275495',	0),
(291,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598430287174',	0),
(292,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598430289245',	0),
(293,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598430298740',	0),
(294,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598430313587',	0),
(295,	'2KM3X00IUUKEB1ENOV',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598430388941',	0),
(296,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598430396081',	0),
(297,	'2KM3X00IUUKEB1ENOV',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598431010186',	0),
(298,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598431023105',	0),
(299,	'2KM3X00IUUKEB1ENOV',	'Start job.',	'10005',	'Artist has been started your job',	'1598431028418',	0),
(300,	'2KM3X00IUUKEB1ENOV',	'Complete job',	'10006',	'Completed your job by artist.',	'1598431037796',	0),
(301,	'2KM3X009JRKE4CUICO',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598431080936',	0),
(302,	'2KM3X009JRKE4CUICO',	'Rating.',	'10012',	'Someone gives you rating.',	'1598431089604',	0),
(303,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598431162406',	0),
(304,	'2KM3X00IUUKEB1ENOV',	'Start job.',	'10005',	'Artist has been started your job',	'1598431174973',	0),
(305,	'2KM3X00IUUKEB1ENOV',	'Complete job',	'10006',	'Completed your job by artist.',	'1598431182275',	0),
(306,	'2KM3X009JRKE4CUICO',	'Paid your invoice.',	'10011',	'Paid your invoice.',	'1598431237099',	0),
(307,	'2KM3X009JRKE4CUICO',	'Rating.',	'10012',	'Someone gives you rating.',	'1598431241548',	0),
(308,	'2KM3X009JRKE4CWAKD',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598433009496',	0),
(309,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598433029308',	0),
(310,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598433347358',	0),
(311,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598433520072',	0),
(312,	'2KM3X009JRKE4CWAKD',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598433582009',	0),
(313,	'2KM3X009JRKE4CUICO',	'Start job.',	'10005',	'Artist has been started your job',	'1598433606245',	0),
(314,	'2KM3X009JRKE4CUICO',	'Complete job',	'10006',	'Completed your job by artist.',	'1598433613554',	0),
(315,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598433645928',	0),
(316,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598433659482',	0),
(317,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598433673945',	0),
(318,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598434262892',	0),
(319,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598434277217',	0),
(320,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598434283644',	0),
(321,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598434312118',	0),
(322,	'2KM3X009JRKE4CWAKD',	'Rejected job.',	'10008',	'Rejected job by artist.',	'1598434319822',	0),
(323,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10009',	'Job accepted successfully.',	'1598434357801',	0),
(324,	'2KM3X009JRKE4CWAKD',	'Rejected job.',	'10008',	'Rejected job by artist.',	'1598434527501',	0),
(325,	'2KM3X009JRKE4CWAKD',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598435673268',	0),
(326,	'2KM3X00IUUKEB1ENOV',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598435741594',	0),
(327,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598435751872',	0),
(328,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598435759735',	0),
(329,	'2KM3X00IUUKEB1ENOV',	'Rating.',	'10012',	'Someone gives you rating.',	'1598435773558',	0),
(330,	'2KM3X009JRKE4CWAKD',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598435841647',	0),
(331,	'2KM3X00IUUKEB1ENOV',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598436087025',	0),
(332,	'2KM3X009JRKE4CWAKD',	'Job Applied.',	'10010',	'Job applied successfully.',	'1598436193614',	0),
(333,	'2KM3X009JRKE4CUICO',	'Accepted job.',	'10002',	'Job accepted successfully.',	'1598436250294',	0),
(334,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598437556409',	0),
(335,	'2KM3X009JRKE4CWAKD',	'Start job.',	'10005',	'Artist has been started your job',	'1598437563030',	0),
(336,	'2KM3X009JRKE4CWAKD',	'Complete job',	'10006',	'Completed your job by artist.',	'1598437571130',	0);

DROP TABLE IF EXISTS `package`;
CREATE TABLE `package` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `package_pub_id` varchar(250) NOT NULL,
  `title` text CHARACTER SET utf8 NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'NA',
  `amount` int NOT NULL,
  `days` int NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `status` int NOT NULL COMMENT '1. Active 0. Deactive',
  `created_at` varchar(255) NOT NULL DEFAULT 'NA',
  `updated_at` varchar(255) NOT NULL DEFAULT 'NA',
  PRIMARY KEY (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `package` (`package_id`, `language`, `package_pub_id`, `title`, `description`, `image`, `amount`, `days`, `is_default`, `status`, `created_at`, `updated_at`) VALUES
(1,	'1',	'49587x7k4fka99m57d',	'Abc Package edit',	'ABC edit',	'NA',	10000,	100,	0,	1,	'NA',	'NA'),
(2,	'1',	'2km3x005a1kb28g8el',	'Default Package',	'Default Signup Package',	'NA',	0,	365,	1,	1,	'NA',	'NA'),
(3,	'1',	'2km3x00bdykb7nytew',	'Monthly Package',	'30 Days Package',	'NA',	1000,	30,	0,	1,	'NA',	'NA'),
(4,	'1',	'2km3x00bdykb7o09ie',	'Quarterly Package',	'84  Days validity',	'NA',	2500,	84,	0,	1,	'NA',	'NA'),
(5,	'1',	'2km3x00bdykb7o27q7',	'Yearly Package',	'365 days Package validity',	'NA',	5000,	365,	0,	1,	'NA',	'NA');

DROP TABLE IF EXISTS `payment_gateway`;
CREATE TABLE `payment_gateway` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `currency` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `api_key_1` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `api_key_2` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `api_key_3` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `api_key_4` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `api_key_5` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `status` int NOT NULL DEFAULT '1',
  `created_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `updated_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `payment_gateway` (`id`, `title`, `description`, `currency`, `api_key_1`, `api_key_2`, `api_key_3`, `api_key_4`, `api_key_5`, `status`, `created_at`, `updated_at`) VALUES
(1,	'Razorpay',	'support rupee only',	'1',	'rzp_live_ZSWpb72LUv7Mxb',	'KpO7mhv2spK3Nj11wRK9wxMW',	'',	'',	'',	1,	'1598260488376',	'');

DROP TABLE IF EXISTS `payout`;
CREATE TABLE `payout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `title` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `description` varchar(250) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `image` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `amount` double NOT NULL,
  `remaining_balance` double NOT NULL,
  `reference_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `payment_type` int NOT NULL,
  `datetime` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `created_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `updated_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `currency_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `payout` (`id`, `user_pub_id`, `title`, `description`, `image`, `amount`, `remaining_balance`, `reference_id`, `payment_type`, `datetime`, `created_at`, `updated_at`, `currency_id`) VALUES
(230090001,	'2KM3X00IUUKEB1ENOV',	'Hello',	'Indian rupee',	'',	10,	2.8,	'sasasas1213212',	0,	'26 Aug 2020 08:08',	'1598431288860',	'',	'1'),
(230090002,	'2KM3X009JRKE4CUICO',	'PetCare Application',	'offer to today',	'',	70,	20,	'454545JSDFKJF',	1,	'26 Aug 2020 08:08',	'1598431472252',	'',	'1'),
(230090003,	'2KM3X009JRKE4CUICO',	'PetCare Application',	'klks;ldfk;sdkfd;lks;klsdl;fkdskf;ldsfdf',	'',	20,	0,	'454545JSDFKJF',	1,	'26 Aug 2020 08:08',	'1598431641726',	'',	'1');

DROP TABLE IF EXISTS `post_job`;
CREATE TABLE `post_job` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `job_id` varchar(20) NOT NULL DEFAULT '',
  `user_pub_id` varchar(100) NOT NULL DEFAULT '',
  `description` text CHARACTER SET utf8 NOT NULL,
  `job_title` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT '',
  `skill_id` int NOT NULL DEFAULT '0',
  `cat_id` varchar(200) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `edit` tinyint NOT NULL DEFAULT '0' COMMENT '0.Edit 1.NotEdit',
  `status` tinyint NOT NULL DEFAULT '0' COMMENT '0.Padding 1.confirm 2.complete 3.reject 4.deactive 5. process',
  `time` varchar(255) NOT NULL DEFAULT 'NA',
  `address` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `latitude` varchar(255) NOT NULL DEFAULT '',
  `longitude` varchar(255) NOT NULL DEFAULT '',
  `date` varchar(200) NOT NULL DEFAULT '',
  `created_at` varchar(255) NOT NULL DEFAULT '',
  `updated_at` varchar(255) NOT NULL DEFAULT '',
  `duration` varchar(10) NOT NULL DEFAULT '1',
  `price` double NOT NULL DEFAULT '0',
  `start_time` varchar(20) NOT NULL DEFAULT '" "',
  `end_time` varchar(20) NOT NULL DEFAULT '" "',
  `artist_pub_id` varchar(20) NOT NULL DEFAULT '',
  `job_start_time` double NOT NULL DEFAULT '0',
  `currency_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `post_job` (`id`, `job_id`, `user_pub_id`, `description`, `job_title`, `skill_id`, `cat_id`, `edit`, `status`, `time`, `address`, `latitude`, `longitude`, `date`, `created_at`, `updated_at`, `duration`, `price`, `start_time`, `end_time`, `artist_pub_id`, `job_start_time`, `currency_id`) VALUES
(77,	'wtm7jpuj',	'2KM3X009JRKE4CUICO',	'test',	'Test',	0,	'1',	0,	2,	'01:02 PM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598427195536',	'1598427559223',	'03',	100,	'1598427559223',	'1598427594865',	'2KM3X00IUUKEB1ENOV',	1598427120,	'1'),
(78,	'53ui6rlq',	'2KM3X009JRKE4CWAKD',	'test',	'test',	0,	'1,2,3,4,5',	0,	2,	'01:26 PM',	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'22.1893476',	'76.0640294',	'26-08-2020',	'1598428683986',	'1598428693826',	'03',	100,	'1598428693826',	'1598428701131',	'2KM3X009JRKE4CUICO',	1598428560,	'1'),
(79,	'f88har9k',	'2KM3X009JRKE4CUICO',	'Test',	'Test',	0,	'1',	0,	2,	'01:35 PM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598429416904',	'1598429441654',	'03',	250,	'1598429441654',	'1598429495446',	'2KM3X00IUUKEB1ENOV',	1598429100,	'1'),
(80,	'437ndo67',	'2KM3X009JRKE4CUICO',	'Test',	'Test',	0,	'1',	0,	2,	'10:44 AM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598429668625',	'1598429737969',	'03',	100,	'1598429737969',	'1598429760083',	'2KM3X00IUUKEB1ENOV',	1598418840,	'1'),
(81,	'aphxwobv',	'2KM3X009JRKE4CUICO',	'bxxbb',	'Test',	0,	'1',	0,	2,	'11:47 AM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598429846557',	'1598429894439',	'03',	100,	'1598429894439',	'1598429903105',	'2KM3X00IUUKEB1ENOV',	1598422620,	'2'),
(82,	'fj3xbc9f',	'2KM3X009JRKE4CUICO',	'Test',	'Test',	0,	'1',	0,	2,	'11:52 AM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598430184883',	'1598430219957',	'03',	15,	'1598430219957',	'1598430247199',	'2KM3X00IUUKEB1ENOV',	1598422920,	'2'),
(83,	'4l1pksqp',	'2KM3X009JRKE4CUICO',	'Test',	'Test',	0,	'1',	0,	2,	'11:53 AM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598430232542',	'1598430289238',	'03',	42,	'1598430289238',	'1598430298733',	'2KM3X00IUUKEB1ENOV',	1598422980,	'1'),
(84,	'5ntfw0n4',	'2KM3X00IUUKEB1ENOV',	'v1 job',	'v1',	0,	'1',	0,	2,	'02:06 PM',	'68, Vijay Nagar Square, Ratna Lok Colony, Indore, Madhya Pradesh 452010, India',	'22.7498404',	'75.8988936',	'26-08-2020',	'1598431002190',	'1598431028409',	'03',	50,	'1598431028409',	'1598431037787',	'2KM3X009JRKE4CUICO',	1598430960,	'2'),
(85,	'z8zj23c7',	'2KM3X00IUUKEB1ENOV',	'v2 job 100 inr ka',	'v2',	0,	'1',	0,	2,	'02:09 PM',	'68, Vijay Nagar Square, Ratna Lok Colony, Indore, Madhya Pradesh 452010, India',	'22.7498409',	'75.8988955',	'26-08-2020',	'1598431162398',	'1598431174963',	'03',	100,	'1598431174963',	'1598431182264',	'2KM3X009JRKE4CUICO',	1598431140,	'1'),
(86,	'1nzbnklp',	'2KM3X009JRKE4CWAKD',	't',	't',	0,	'1',	0,	2,	'02:38 PM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.188084254671086',	'76.06252044439316',	'26-08-2020',	'1598433002403',	'1598433347350',	'03',	25,	'1598433347350',	'1598433520065',	'2KM3X009JRKE4CUICO',	1598432880,	'1'),
(87,	'fmvnvchi',	'2KM3X009JRKE4CUICO',	'h',	'hsh',	0,	'4,5',	0,	2,	'11:49 AM',	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'22.1880789',	'76.06259',	'26-08-2020',	'1598433582002',	'1598433606231',	'03',	100,	'1598433606231',	'1598433613545',	'2KM3X009JRKE4CWAKD',	1598422740,	'2'),
(88,	'0dfs9ke2',	'2KM3X00IUUKEB1ENOV',	'hello friends if you are',	'job description',	0,	'1',	0,	0,	'02:49 PM',	'68, Vijay Nagar Square, Ratna Lok Colony, Indore, Madhya Pradesh 452010, India',	'22.7498405',	'75.8988961',	'26-08-2020',	'1598433614948',	'1598433614948',	'03',	425,	'\" \"',	'\" \"',	'',	1598433540,	'1'),
(89,	'qdcqiw9p',	'2KM3X009JRKE4CWAKD',	'te',	'tr',	0,	'1',	0,	2,	'02:49 PM',	'Unnamed Road, Madhya Pradesh 450554, India',	'22.203619',	'76.0814319',	'26-08-2020',	'1598433645921',	'1598433659476',	'03',	100,	'1598433659476',	'1598434283636',	'2KM3X009JRKE4CUICO',	1598433540,	'1'),
(90,	'ckbc02vr',	'2KM3X009JRKE4CWAKD',	'test',	'Ted',	0,	'1',	0,	2,	'02:00 PM',	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'22.1893476',	'76.0640294',	'26-08-2020',	'1598434262881',	'1598434277207',	'03',	100,	'1598434277207',	'1598437556396',	'2KM3X009JRKE4CUICO',	1598430600,	'1'),
(91,	'kl7z8vs3',	'2KM3X009JRKE4CWAKD',	'td',	'ar',	0,	'1',	0,	2,	'03:00 PM',	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'22.1893476',	'76.0640294',	'26-08-2020',	'1598434312111',	'1598435751865',	'03',	100,	'1598435751864',	'1598435759726',	'2KM3X00IUUKEB1ENOV',	1598434200,	'1'),
(92,	'3vf8oiyy',	'2KM3X009JRKE4CWAKD',	't',	'y',	0,	'1',	0,	0,	'03:01 PM',	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'22.1893476',	'76.0640294',	'26-08-2020',	'1598434357794',	'1598434357794',	'03',	100,	'\" \"',	'\" \"',	'2KM3X009JRKE4CUICO',	1598434260,	'1'),
(93,	'u4d9exq6',	'2KM3X009JRKE4CWAKD',	'hdh',	'gd',	0,	'1',	0,	2,	'03:31 PM',	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'22.1892847',	'76.0633043',	'26-08-2020',	'1598436165752',	'1598437563022',	'03',	51,	'1598437563022',	'1598437571123',	'2KM3X009JRKE4CUICO',	1598436060,	'1'),
(94,	'npe2wagy',	'2KM3X002BJKE5H2M9C',	'test',	'need photographer',	0,	'5',	0,	0,	'10:30 AM',	'Khandwa Rd, Choral, Madhya Pradesh 453441, India',	'22.4493501',	'75.9480525',	'27-08-2020',	'1598440423037',	'1598440423037',	'03',	50,	'\" \"',	'\" \"',	'',	1598504400,	'1');

DROP TABLE IF EXISTS `rating`;
CREATE TABLE `rating` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` text NOT NULL,
  `artist_pub_id` text NOT NULL,
  `created_at` varchar(200) NOT NULL DEFAULT '',
  `updated_at` varchar(200) NOT NULL DEFAULT '',
  `status` int NOT NULL DEFAULT '1',
  `rating` double NOT NULL DEFAULT '0',
  `description` text CHARACTER SET utf8 NOT NULL,
  `invoice_id` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `rating` (`id`, `user_pub_id`, `artist_pub_id`, `created_at`, `updated_at`, `status`, `rating`, `description`, `invoice_id`) VALUES
(30,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	'1598422049996',	'1598422049996',	1,	5,	'yyy',	'J5QJA9UB'),
(31,	'2KM3X009JRKE4CUICO',	'2KM3X009JRKE4CWAKD',	'1598424963225',	'1598424963225',	1,	5,	'ggg',	'APBPF0H1'),
(32,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598427798257',	'1598427798257',	1,	5,	'good job bhai....',	'0ERES8BF'),
(33,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	'1598427939627',	'1598427939627',	1,	5,	'Nice',	'0ERES8BF'),
(34,	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	'1598428716069',	'1598428716069',	1,	4.5,	'tttt',	'AJEGMCDC'),
(35,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598429528392',	'1598429528392',	1,	3,	'my 2 job for varun sir',	'NQQNLLAP'),
(36,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	'1598429533997',	'1598429533997',	1,	4.5,	'Yeee',	'NQQNLLAP'),
(37,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598429925179',	'1598429925179',	1,	2.5,	'use wala job tha',	'TYP7OLHU'),
(38,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	'1598429959312',	'1598429959312',	1,	4.5,	'Tee',	'TYP7OLHU'),
(39,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	'1598430258249',	'1598430258249',	1,	4,	'Ee',	'WAY38WKZ'),
(40,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598430259665',	'1598430259665',	1,	2,	'15 usd',	'WAY38WKZ'),
(41,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598430313584',	'1598430313584',	1,	2,	'ha bhai',	'FCYSQIQ3'),
(42,	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	'1598430396075',	'1598430396076',	1,	5,	'Online Pay',	'FCYSQIQ3'),
(43,	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	'1598431089599',	'1598431089599',	1,	2.5,	'tik h v1',	'OB3QLR0V'),
(44,	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	'1598431241544',	'1598431241544',	1,	2.5,	'ghhj',	'C92RQVIK'),
(45,	'2KM3X00IUUKEB1ENOV',	'2KM3X00IUUKEB1ENOV',	'1598435773554',	'1598435773554',	1,	3.5,	'hhhhh',	'7HCZT5WA');

DROP TABLE IF EXISTS `referral_setting`;
CREATE TABLE `referral_setting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `no_of_usages` tinytext NOT NULL,
  `amount` text NOT NULL,
  `type` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `referral_usages`;
CREATE TABLE `referral_usages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(200) NOT NULL,
  `referral_code` text NOT NULL,
  `redeem` tinyint NOT NULL DEFAULT '0' COMMENT '0.Not 1.credit',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `service`;
CREATE TABLE `service` (
  `service_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(255) CHARACTER SET utf8 NOT NULL,
  `user_pub_id` varchar(255) NOT NULL,
  `service_price` float NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `service_images`;
CREATE TABLE `service_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_id` int NOT NULL,
  `service_image` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `setting`;
CREATE TABLE `setting` (
  `setting_id` int NOT NULL AUTO_INCREMENT,
  `def_key` text NOT NULL,
  `def_value` text NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`setting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `skill`;
CREATE TABLE `skill` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cat_id` varchar(10) NOT NULL,
  `skill` varchar(100) NOT NULL,
  `status` int NOT NULL DEFAULT '1',
  `created_at` varchar(200) NOT NULL,
  `updated_at` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `subscription_history`;
CREATE TABLE `subscription_history` (
  `subs_id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(255) NOT NULL,
  `package_pub_id` varchar(255) NOT NULL,
  `transaction_id` int NOT NULL,
  `order_id` varchar(50) NOT NULL,
  `subs_start_date` varchar(255) NOT NULL,
  `subs_end_date` varchar(255) NOT NULL,
  `subs_amount` int NOT NULL,
  `subs_title` text NOT NULL,
  `subs_days` int NOT NULL,
  `subs_created_at` varchar(255) NOT NULL,
  `subs_status` int NOT NULL DEFAULT '1' COMMENT '0.deactive 1. active',
  PRIMARY KEY (`subs_id`),
  KEY `transaction_id` (`transaction_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `subscription_transactions`;
CREATE TABLE `subscription_transactions` (
  `transactions_id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(255) NOT NULL,
  `package_pub_id` varchar(255) NOT NULL,
  `trans_id` varchar(255) NOT NULL,
  `amount` int NOT NULL,
  `payment_status` int NOT NULL,
  `created_at` varchar(255) NOT NULL,
  `updated_at` varchar(255) NOT NULL,
  PRIMARY KEY (`transactions_id`),
  KEY `trans_id` (`trans_id`),
  KEY `amount` (`amount`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `ticket`;
CREATE TABLE `ticket` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` text NOT NULL,
  `description` text CHARACTER SET utf8 NOT NULL,
  `status` int NOT NULL DEFAULT '0' COMMENT '0 pendding 1.reslove 2.close',
  `created_at` varchar(299) NOT NULL,
  `date_time` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `title` text CHARACTER SET utf8 NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `ticket_comments`;
CREATE TABLE `ticket_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint NOT NULL,
  `comment` text CHARACTER SET utf8 NOT NULL,
  `role` int NOT NULL DEFAULT '0',
  `user_pub_id` varchar(100) NOT NULL DEFAULT '0',
  `date_time` tinytext CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `created_at` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `transaction`;
CREATE TABLE `transaction` (
  `trans_id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(255) NOT NULL,
  `amount` float NOT NULL,
  `point` int NOT NULL,
  `trans_status` int NOT NULL DEFAULT '0' COMMENT '0.pending,1.paid',
  `trans_type` int NOT NULL COMMENT '0.payout,1.purchase',
  `created_at` varchar(255) NOT NULL,
  `payment_trans_id` varchar(255) NOT NULL DEFAULT '0',
  PRIMARY KEY (`trans_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `transaction_history`;
CREATE TABLE `transaction_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `point` int NOT NULL,
  `trans_type` int NOT NULL COMMENT '0.debit,1.credit',
  `invoice_id` varchar(255) NOT NULL COMMENT 'invoice_id,trans_id',
  `target_id` varchar(255) NOT NULL DEFAULT '' COMMENT 'user_id,0.admin',
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) NOT NULL,
  `email_id` varchar(70) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT 'NA',
  `mobile_no` varchar(20) NOT NULL DEFAULT 'NA',
  `gender` varchar(20) NOT NULL DEFAULT 'NA' COMMENT '1 male, 2female, 0other',
  `cat_id` varchar(50) NOT NULL DEFAULT 'NA',
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `name` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `description` varchar(400) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `adhar_no` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NA',
  `pancard_no` varchar(400) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'NA',
  `role` int NOT NULL DEFAULT '1' COMMENT '1 user,2 artist',
  `address` varchar(200) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `country_code` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT '0',
  `qualification` varchar(250) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `image` varchar(255) NOT NULL DEFAULT 'NA',
  `device_id` varchar(255) NOT NULL DEFAULT 'NA',
  `device_token` varchar(255) NOT NULL DEFAULT 'NA',
  `device_type` varchar(255) NOT NULL DEFAULT 'NA',
  `created_at` varchar(255) NOT NULL DEFAULT 'NA',
  `updated_at` varchar(255) NOT NULL DEFAULT 'NA',
  `status` varchar(5) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '0' COMMENT '2 delete',
  `country` varchar(20) NOT NULL DEFAULT 'NA',
  `city` varchar(20) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `skill_id` varchar(10) NOT NULL DEFAULT 'NA',
  `skill_text` varchar(255) NOT NULL DEFAULT 'NA',
  `referral_code` varchar(200) NOT NULL,
  `signUpBy` tinyint NOT NULL DEFAULT '1',
  `price` int NOT NULL DEFAULT '0',
  `bio` varchar(255) CHARACTER SET utf8 NOT NULL DEFAULT 'NA',
  `job_done` int NOT NULL DEFAULT '0',
  `earning` double NOT NULL DEFAULT '0',
  `email_verified` varchar(200) NOT NULL DEFAULT 'NA',
  `is_private` int NOT NULL DEFAULT '0' COMMENT '1.private',
  `online_type` varchar(255) NOT NULL DEFAULT 'Normal' COMMENT 'Normal,Facebook,Instagram,Twitter',
  `sub_end_date` varchar(255) DEFAULT 'NA',
  `avg_rating` int DEFAULT '0',
  `is_artist` varchar(5) DEFAULT '0',
  `commission` double DEFAULT '0',
  `final_balance` double DEFAULT '0',
  `currency_id` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user` (`user_id`, `user_pub_id`, `email_id`, `password`, `mobile_no`, `gender`, `cat_id`, `latitude`, `longitude`, `name`, `description`, `adhar_no`, `pancard_no`, `role`, `address`, `country_code`, `qualification`, `image`, `device_id`, `device_token`, `device_type`, `created_at`, `updated_at`, `status`, `country`, `city`, `skill_id`, `skill_text`, `referral_code`, `signUpBy`, `price`, `bio`, `job_done`, `earning`, `email_verified`, `is_private`, `online_type`, `sub_end_date`, `avg_rating`, `is_artist`, `commission`, `final_balance`, `currency_id`) VALUES
(233,	'2KM3X009JRKE4CUICO',	'varun@samyotech.com',	'$2a$05$uQuVVcrIo0iOKr9r31QFweaW84IqM4eOgJ05nY3D97JuGK21JPebW',	'7000919818',	'1',	'NA',	22.1879065,	76.0625931,	'Varun Verma',	'Test',	'123456',	'Test',	1,	'146 Ahilya Bhavan, Behind, Ward No 17, Irrigation Colony, Sanawad, Madhya Pradesh 451111, India',	'+91',	'NA',	'Rojgar/images/image-1598021889174.jpg',	'123456',	'eGl_u3_RTx6sod7oxykeE8:APA91bECLDZEkBRogWwh0iHN2jD6OfQL52xX-zFLCRa0dRz1yRo4nUQd3wGC89QDbvZSYMlgVPEK528M5i-K7f3ggE0wAbkdPT3N2QGF5agc_JN_guMQS1Vpm4Y59pRjLOsZ_oWfp1CK',	'ANDROID',	'1598021678186',	'1598021678186',	'1',	'NA',	'Indore',	'NA',	'NA',	'J5VLK9',	1,	100,	'Test',	0,	0,	'1',	0,	'Normal',	'1629557678186',	0,	'1',	10,	100,	'1'),
(234,	'2KM3X009JRKE4CWAKD',	'vermavarun099@gmail.com',	'$2a$05$tRSDY7Q8kyMXu4ywCEBt4.L.thXamGmwgPS.EubpGQdOQlSX3E8/i',	'8109973009',	'1',	'NA',	22.190110848792003,	76.0644781216979,	'Vicky',	'Test',	'9999999999',	'Test',	1,	'Khandwa Rd, Sanawad, Madhya Pradesh 450554, India',	'undefined',	'NA',	'Rojgar/images/image-1598021844655.jpg',	'123456',	'dQCNf22dQpi6ZDxVzu3HJV:APA91bHQQ9axuip9JZYOePwuNVRUTUScQY-2KkyQdMqtnpe8UqTA-kP3L1NTFTqJcH3_eVfqFjAIXTtM8anNx7pPlDSUfRWgdZ_xgRfvzUDL22H2RMFSXj9MuetZKgw3VVigfk9p1Bv9',	'ANDROID',	'1598021761406',	'1598021761406',	'1',	'NA',	'Indore',	'NA',	'NA',	'ANBUTZ',	1,	100,	'Test',	0,	0,	'1',	0,	'Normal',	'1629557761406',	0,	'1',	0,	0,	'2'),
(235,	'2KM3X00DDBKE4FLVJA',	'abc.mongkp@gmail.com',	'$2a$05$GQ8BK/GcRaiX/O2LrN9A3uHnDi.CYx/zdY2Ka00EVzMGXpo5mDhHy',	'NA',	'1',	'NA',	18.0329428,	102.6411453,	'mong',	'Test',	'5566',	'7778',	1,	'13 Dongdok Village Street, Laos',	'0',	'NA',	'Rojgar/images/image-1598030007660.jpg',	'123456',	'euBuxE7aSB-4UkML-IJeOS:APA91bGFyNJoi3MJaZ71MuFdznJWafnBM9QCNG_IiUFBfhap_RjcFdJCM9cyMWVTGMB3BBb_iHbRI3HIyR62vtzU-nveoP2i31nRYk52-8irMDgj3tN2QMT0OZcvCHMAGA6mKhhrq0NM',	'ANDROID',	'1598026314215',	'1598026314215',	'1',	'NA',	'India',	'NA',	'NA',	'R1CLZV',	1,	50000,	'10',	0,	0,	'1',	0,	'Normal',	'1629562314215',	0,	'1',	0,	0,	''),
(236,	'2KM3X002BJKE5H2M9C',	'jaiswalv764@gmail.com',	'$2a$05$mu1iAr5uqCdm70gbxo8YGupzorzdp22.tmR/wBRaPj161swYIbh5m',	'9752759575',	'1',	'NA',	22.4456351,	75.951269,	'Vikas Jaiswal',	'NA',	'NA',	'NA',	1,	'Khandwa Rd, Choral, Madhya Pradesh 453441, India',	'undefined',	'NA',	'NA',	'123456',	'ez4xZUDQRwyNlEWzbmVclQ:APA91bEu3JYVp2IdgYCDEkEs80gCZQH8CB5-J0vQli6uPdaKO-iOcLu5XR8WzA5G9g-bR6pu0JahwRx98nP_k7U-oazTPoa8Vs47tIXjKHaGsseGy_EDzd3_RAPOZ6EBDmGQVZdAIgSE',	'ANDROID',	'1598089241138',	'1598089241138',	'1',	'NA',	'Indore',	'NA',	'NA',	'MJX78Q',	1,	100,	'NA',	0,	0,	'1',	0,	'Normal',	'1629625241138',	0,	'1',	0,	0,	'1'),
(237,	'2KM3X00NWQKE9L97C0',	'ankitg.byloapp@gmail.com',	'$2a$05$KLWB.9fsqobDdwIpnkBJMeJi0RFLME1omrr3.u.LoHUxyG2b0kCnK',	'NA',	'NA',	'NA',	0,	0,	'Ankit gupta',	'NA',	'NA',	'NA',	1,	'NA',	'0',	'NA',	'NA',	'123456',	'123456',	'ANDROID',	'1598338131554',	'1598338131554',	'1',	'NA',	'NA',	'NA',	'NA',	'CVHHKB',	1,	0,	'NA',	0,	0,	'1',	0,	'Normal',	'1629874131554',	0,	'0',	0,	0,	''),
(238,	'2KM3X00M1CKE9X3VZX',	'sumitgade31@gmail.com',	'$2a$05$hQivRr45M29781JEC2cvNuv45S.tdBTg9e6M0BwuBCFGhInjOsRcG',	'NA',	'1',	'NA',	22.73386,	75.880966,	'Sumit',	'Wedding planner',	'NA',	'NA',	1,	'Palacia, Indore, India, 452003 ',	'0',	'NA',	'Rojgar/images/image-1598358122208.png',	'1234',	'cv4iAxlZ-EvuvPi-3kePUe:APA91bFKw9l_6ZnpGV6loQc2snadxK1fMh3_McpupZ7ikssbIxnkm23X3qK8BniA80o2Ytq-9uqoi22LavhI0cevzGWiN0bCtta5X8tDVEUl7YNeQoR2HOZQJH-eW95iUVr6aGa6t4zg',	'iOS',	'1598358038976',	'1598358038976',	'1',	'NA',	'Indore',	'NA',	'NA',	'9VOHKI',	1,	500,	'wedding',	0,	0,	'1',	0,	'Normal',	'1629894038976',	0,	'0',	0,	0,	''),
(239,	'2KM3X00IUUKEB1ENOV',	'mobileappz007@gmail.com',	'$2a$05$tFbBNl5RH/tGVW1UgurmneaP30/PkxehPWxbEEEouGg12yEQqfxcO',	'7869999639',	'1',	'NA',	22.7498401,	75.8988875,	'amit',	'I am good driver I am good driver I am good driver I am good driver I am good driver',	'523256352856',	'FUJC5744',	1,	'68, Vijay Nagar Square, Ratna Lok Colony, Indore, Madhya Pradesh 452010, India',	'undefined',	'NA',	'Rojgar/images/image-1598426828600.jpg',	'123456',	'd5XcAu7ET8uwDj9R1mX8x2:APA91bH6ZsfQx6lQZld8fcQZJhJe0B54TCsH4vYFNcRG2QC2Bl_noDCiErolMYU7IJBaKHA-AEpSttQZpQZzT8yIiVXoQAS-W-0u884WLMZVxHQpWlXhOBAoumEhL1RJ3YK2ehB6Pe9L',	'ANDROID',	'1598425726064',	'1598425726064',	'1',	'NA',	'indo',	'NA',	'NA',	'LDXX6C',	1,	250,	'I am good driver',	0,	0,	'1',	0,	'Normal',	'1629961726064',	0,	'1',	10,	0,	'1');

DROP TABLE IF EXISTS `user_balance`;
CREATE TABLE `user_balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` varchar(100) NOT NULL,
  `job_id` varchar(100) NOT NULL DEFAULT 'NA',
  `user_pub_id` varchar(100) NOT NULL,
  `artist_pub_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `invoice_amt` double NOT NULL,
  `comm_rate` double NOT NULL,
  `comm_amt` double NOT NULL,
  `final_amt` double NOT NULL,
  `old_balance` double NOT NULL,
  `new_balance` double NOT NULL,
  `payment_type` int NOT NULL COMMENT '0.Online 1.case',
  `status` int NOT NULL DEFAULT '1',
  `statement_type` int NOT NULL DEFAULT '0' COMMENT '0.credit 1. debit',
  `created_at` double NOT NULL DEFAULT '0',
  `updated_at` double NOT NULL DEFAULT '0',
  `currency_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_balance` (`id`, `invoice_id`, `job_id`, `user_pub_id`, `artist_pub_id`, `invoice_amt`, `comm_rate`, `comm_amt`, `final_amt`, `old_balance`, `new_balance`, `payment_type`, `status`, `statement_type`, `created_at`, `updated_at`, `currency_id`) VALUES
(10,	'0ERES8BF',	'wtm7jpuj',	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	100,	0,	0,	100,	0,	0,	1,	1,	1,	1598427933080,	0,	'1'),
(11,	'AJEGMCDC',	'53ui6rlq',	'2KM3X009JRKE4CWAKD',	'2KM3X009JRKE4CUICO',	100,	0,	0,	100,	0,	0,	1,	1,	1,	1598428711908,	0,	'1'),
(12,	'NQQNLLAP',	'f88har9k',	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	250,	10,	25,	225,	0,	-25,	1,	1,	1,	1598429530277,	0,	'1'),
(13,	'TYP7OLHU',	'aphxwobv',	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	100,	10,	10,	90,	0,	-10,	1,	1,	1,	1598429955352,	0,	'2'),
(14,	'WAY38WKZ',	'fj3xbc9f',	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	15,	10,	1.5,	13.5,	-10,	-11.5,	1,	1,	1,	1598430253679,	0,	'2'),
(15,	'FCYSQIQ3',	'4l1pksqp',	'2KM3X009JRKE4CUICO',	'2KM3X00IUUKEB1ENOV',	42,	10,	4.2,	37.8,	-25,	12.799999999999997,	0,	1,	0,	1598430388934,	0,	'1'),
(16,	'OB3QLR0V',	'5ntfw0n4',	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	50,	0,	0,	50,	0,	0,	1,	1,	1,	1598431080932,	0,	'2'),
(17,	'C92RQVIK',	'z8zj23c7',	'2KM3X00IUUKEB1ENOV',	'2KM3X009JRKE4CUICO',	100,	10,	10,	90,	0,	90,	0,	1,	0,	1598431237089,	0,	'1');

DROP TABLE IF EXISTS `user_coupon`;
CREATE TABLE `user_coupon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(255) NOT NULL,
  `invoice_id` varchar(255) NOT NULL,
  `coupon_id` int NOT NULL,
  `created_at` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user_current_balance`;
CREATE TABLE `user_current_balance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_pub_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `currency_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_current_balance` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '1',
  `created_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `updated_at` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_current_balance` (`id`, `user_pub_id`, `currency_id`, `user_current_balance`, `status`, `created_at`, `updated_at`) VALUES
(3,	'2KM3X00IUUKEB1ENOV',	'1',	'2.80',	'1',	'1598427933083',	'1598431288863'),
(4,	'2KM3X009JRKE4CUICO',	'1',	'0',	'1',	'1598428711912',	'1598431641731'),
(5,	'2KM3X00IUUKEB1ENOV',	'2',	'-11.5',	'1',	'1598429955356',	'1598430253683'),
(6,	'2KM3X009JRKE4CUICO',	'2',	'0',	'1',	'1598431080934',	'');

DROP TABLE IF EXISTS `user_point`;
CREATE TABLE `user_point` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `point` int NOT NULL,
  `created_at` varchar(255) NOT NULL DEFAULT '',
  `updated_at` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_point` (`id`, `user_id`, `point`, `created_at`, `updated_at`) VALUES
(49,	'2KM3X009JRKE4CUICO',	0,	'0',	''),
(50,	'2KM3X009JRKE4CWAKD',	0,	'0',	''),
(51,	'2KM3X00DDBKE4FLVJA',	0,	'0',	''),
(52,	'2KM3X002BJKE5H2M9C',	0,	'0',	''),
(53,	'2KM3X00NWQKE9L97C0',	0,	'0',	''),
(54,	'2KM3X00M1CKE9X3VZX',	0,	'0',	''),
(55,	'2KM3X00IUUKEB1ENOV',	0,	'0',	'');

-- 2020-08-26 11:15:59