-- --------------------------------------------------------
-- Host:                         10.20.18.132
-- Server version:               5.5.24-0ubuntu0.12.04.1 - (Ubuntu)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for pcs9700
CREATE DATABASE IF NOT EXISTS `pcs9700` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `pcs9700`;


-- Dumping structure for table pcs9700.analogueother201608
CREATE TABLE IF NOT EXISTS `analogueother201608` (
  `attr_oid` bigint(16) unsigned NOT NULL DEFAULT '0',
  `attr_time` int(8) unsigned NOT NULL DEFAULT '0',
  `fValue` float DEFAULT NULL,
  `RESULT_ANA_STOP` tinyint(3) DEFAULT NULL,
  `fMax` float DEFAULT NULL,
  `tMax` bigint(19) unsigned DEFAULT NULL,
  `fMin` float DEFAULT NULL,
  `tMin` bigint(19) unsigned DEFAULT NULL,
  `fAvgValue` float DEFAULT NULL,
  `fLoadRatio` float DEFAULT NULL,
  `fMaxP` float DEFAULT NULL,
  `fMinP` float DEFAULT NULL,
  `fMaxQ` float DEFAULT NULL,
  `fMinQ` float DEFAULT NULL,
  `fMaxI` float DEFAULT NULL,
  `fMinI` float DEFAULT NULL,
  `usStateTag` int(9) unsigned DEFAULT NULL,
  PRIMARY KEY (`attr_oid`,`attr_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
