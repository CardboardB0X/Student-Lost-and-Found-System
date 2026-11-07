-- MySQL Database Initialization Script
-- Database: lost_and_found_db
-- Strict Role-Based Access Control and Chain of Custody

CREATE DATABASE IF NOT EXISTS `lost_and_found_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lost_and_found_db`;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `student_staff_id` VARCHAR(50) NOT NULL UNIQUE,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'STAFF', 'SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN', 'AUDITOR') NOT NULL DEFAULT 'STUDENT',
  `status` ENUM('ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION') NOT NULL DEFAULT 'ACTIVE',
  `phone_number` VARCHAR(30) NULL,
  `department` VARCHAR(100) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_users_role_status` (`role`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `description` VARCHAR(255) NULL,
  `is_high_value` BOOLEAN DEFAULT FALSE,
  `retention_period_days` INT DEFAULT 90,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Storage Locations
CREATE TABLE IF NOT EXISTS `storage_locations` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `campus_building` VARCHAR(100) NOT NULL,
  `room_or_locker` VARCHAR(100) NOT NULL,
  `bin_number` VARCHAR(50) NULL,
  `is_secure_vault` BOOLEAN DEFAULT FALSE,
  `notes` VARCHAR(255) NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Found Items (In Custody)
CREATE TABLE IF NOT EXISTS `found_items` (
  `id` VARCHAR(36) NOT NULL,
  `item_code` VARCHAR(30) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `category_id` INT NOT NULL,
  `public_description` TEXT NOT NULL,
  `private_verification_details` TEXT NOT NULL, -- Blind-proof secrets (serial, passcode clue, engravings)
  `primary_color` VARCHAR(50) NULL,
  `brand` VARCHAR(100) NULL,
  `location_found` VARCHAR(255) NOT NULL,
  `date_found` DATETIME NOT NULL,
  `storage_location_id` INT NOT NULL,
  `status` ENUM('REGISTERED', 'STORED', 'CLAIM_PENDING', 'RETURNED', 'AUCTIONED', 'DONATED', 'DISPOSED') NOT NULL DEFAULT 'STORED',
  `logged_by_user_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`storage_location_id`) REFERENCES `storage_locations`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`logged_by_user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX `idx_found_status_date` (`status`, `date_found`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Item Images
CREATE TABLE IF NOT EXISTS `item_images` (
  `id` VARCHAR(36) NOT NULL,
  `found_item_id` VARCHAR(36) NOT NULL,
  `image_url` VARCHAR(1000) NOT NULL,
  `is_public` BOOLEAN DEFAULT TRUE,
  `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`found_item_id`) REFERENCES `found_items`(`id`) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Lost Item Reports
CREATE TABLE IF NOT EXISTS `lost_reports` (
  `id` VARCHAR(36) NOT NULL,
  `report_code` VARCHAR(30) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `category_id` INT NOT NULL,
  `description` TEXT NOT NULL,
  `identifying_mark` TEXT NULL,
  `brand` VARCHAR(100) NULL,
  `primary_color` VARCHAR(50) NULL,
  `location_lost` VARCHAR(255) NULL,
  `date_lost` DATETIME NOT NULL,
  `status` ENUM('OPEN', 'POTENTIAL_MATCH', 'RESOLVED', 'CANCELLED') NOT NULL DEFAULT 'OPEN',
  `reported_by_user_id` VARCHAR(36) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`reported_by_user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Claims
CREATE TABLE IF NOT EXISTS `claims` (
  `id` VARCHAR(36) NOT NULL,
  `claim_code` VARCHAR(30) NOT NULL UNIQUE,
  `found_item_id` VARCHAR(36) NOT NULL,
  `claimant_id` VARCHAR(36) NOT NULL,
  `proof_description` TEXT NOT NULL,
  `identifying_marks_provided` TEXT NOT NULL,
  `status` ENUM('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SUBMITTED',
  `reviewed_by_user_id` VARCHAR(36) NULL,
  `rejection_reason` TEXT NULL,
  `review_notes` TEXT NULL,
  `handover_timestamp` DATETIME NULL,
  `handover_witness_id` VARCHAR(36) NULL,
  `claimant_signature_ref` VARCHAR(1000) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`found_item_id`) REFERENCES `found_items`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`claimant_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (`handover_witness_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE SET NULL,
  INDEX `idx_claims_claimant_status` (`claimant_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Immutable Audit Logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id` BIGINT AUTO_INCREMENT NOT NULL,
  `entity_type` VARCHAR(50) NOT NULL,
  `entity_id` VARCHAR(36) NOT NULL,
  `action` VARCHAR(50) NOT NULL,
  `actor_id` VARCHAR(36) NOT NULL,
  `actor_ip` VARCHAR(45) NOT NULL DEFAULT '127.0.0.1',
  `old_values` JSON NULL,
  `new_values` JSON NULL,
  `notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
  INDEX `idx_audit_actor` (`actor_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
