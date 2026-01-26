-- Art of Rust Database Schema
-- MySQL 5.7+ / MariaDB 10.2+
--
-- Import this file to set up your database:
-- mysql -u username -p database_name < schema.sql
--
-- Or import via phpMyAdmin in cPanel

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- USERS TABLE
-- Stores authenticated Steam users
-- =============================================================================
CREATE TABLE IF NOT EXISTS `users` (
    `steam_id` VARCHAR(20) NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `avatar_url` VARCHAR(500) DEFAULT NULL,
    `is_admin` TINYINT(1) NOT NULL DEFAULT 0,
    `is_vip` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `last_login` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`steam_id`),
    INDEX `idx_users_admin` (`is_admin`),
    INDEX `idx_users_last_login` (`last_login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- PLAYERS TABLE
-- Stores player statistics for leaderboards
-- =============================================================================
CREATE TABLE IF NOT EXISTS `players` (
    `steam_id` VARCHAR(20) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `kills` INT UNSIGNED NOT NULL DEFAULT 0,
    `deaths` INT UNSIGNED NOT NULL DEFAULT 0,
    `headshots` INT UNSIGNED NOT NULL DEFAULT 0,
    `playtime` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Playtime in minutes',
    `longest_kill` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Longest kill distance in meters',
    `last_seen` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`steam_id`),
    INDEX `idx_players_kills` (`kills` DESC),
    INDEX `idx_players_playtime` (`playtime` DESC),
    INDEX `idx_players_headshots` (`headshots` DESC),
    INDEX `idx_players_last_seen` (`last_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- WIPES TABLE
-- Stores wipe schedule and history
-- =============================================================================
CREATE TABLE IF NOT EXISTS `wipes` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('full', 'map', 'bp') NOT NULL DEFAULT 'map',
    `date` DATETIME NOT NULL,
    `map_size` INT UNSIGNED DEFAULT NULL,
    `map_seed` VARCHAR(50) DEFAULT NULL,
    `notes` TEXT DEFAULT NULL,
    `completed` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_wipes_date` (`date` DESC),
    INDEX `idx_wipes_completed` (`completed`, `date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- NEWS TABLE
-- Stores news posts and announcements
-- =============================================================================
CREATE TABLE IF NOT EXISTS `news` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `excerpt` VARCHAR(500) DEFAULT NULL,
    `author_steam_id` VARCHAR(20) DEFAULT NULL,
    `published` TINYINT(1) NOT NULL DEFAULT 0,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_news_published` (`published`, `created_at` DESC),
    INDEX `idx_news_created` (`created_at` DESC),
    CONSTRAINT `fk_news_author` FOREIGN KEY (`author_steam_id`)
        REFERENCES `users` (`steam_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SERVER_STATS TABLE
-- Stores historical server statistics
-- =============================================================================
CREATE TABLE IF NOT EXISTS `server_stats` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `players` INT UNSIGNED NOT NULL DEFAULT 0,
    `queue` INT UNSIGNED NOT NULL DEFAULT 0,
    `fps` INT UNSIGNED NOT NULL DEFAULT 0,
    `uptime` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Uptime in seconds',
    PRIMARY KEY (`id`),
    INDEX `idx_server_stats_timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SAMPLE DATA (Optional - Remove in production)
-- =============================================================================

-- Insert a sample wipe schedule entry
INSERT INTO `wipes` (`type`, `date`, `map_size`, `notes`, `completed`) VALUES
('full', DATE_ADD(NOW(), INTERVAL 7 DAY), 4000, 'Monthly force wipe', 0),
('map', DATE_ADD(NOW(), INTERVAL 14 DAY), 4000, 'Bi-weekly map wipe', 0);

-- Insert a sample news post (requires a user first, so commented out)
-- INSERT INTO `news` (`title`, `content`, `excerpt`, `published`) VALUES
-- ('Welcome to Art of Rust', 'Welcome to our new website! Stay tuned for updates.', 'Welcome to our new website!', 1);

SET FOREIGN_KEY_CHECKS = 1;
