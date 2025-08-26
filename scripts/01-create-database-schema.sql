-- Smart Crop Support System Database Schema
-- PostgreSQL/MySQL compatible schema

-- Users table for farmers and admins
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(255),
    farm_size DECIMAL(10,2), -- in acres
    crops JSON, -- array of crops grown
    role ENUM('farmer', 'admin') DEFAULT 'farmer',
    language_preference VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Disease detection records
CREATE TABLE IF NOT EXISTS disease_detections (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_filename VARCHAR(255),
    disease VARCHAR(255) NOT NULL,
    confidence DECIMAL(5,4) NOT NULL, -- 0.0000 to 1.0000
    treatment TEXT,
    severity ENUM('None', 'Low', 'Medium', 'High', 'Critical') DEFAULT 'Medium',
    crop_type VARCHAR(100),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_disease (disease),
    INDEX idx_created_at (created_at)
);

-- Mandi prices data
CREATE TABLE IF NOT EXISTS mandi_prices (
    id VARCHAR(36) PRIMARY KEY,
    crop VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    market VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    min_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    modal_price DECIMAL(10,2) NOT NULL,
    price_date DATE NOT NULL,
    unit VARCHAR(50) DEFAULT 'per quintal',
    source VARCHAR(255), -- data source URL
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_crop (crop),
    INDEX idx_state (state),
    INDEX idx_price_date (price_date),
    INDEX idx_market (market)
);

-- Government schemes
CREATE TABLE IF NOT EXISTS government_schemes (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    benefits TEXT NOT NULL,
    application_process TEXT NOT NULL,
    deadline DATE,
    status ENUM('Active', 'Inactive', 'Expired') DEFAULT 'Active',
    category VARCHAR(100) NOT NULL,
    target_states JSON, -- array of applicable states
    official_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_deadline (deadline)
);

-- Weather data cache
CREATE TABLE IF NOT EXISTS weather_data (
    id VARCHAR(36) PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    temperature DECIMAL(5,2),
    humidity INT,
    wind_speed DECIMAL(5,2),
    rainfall DECIMAL(6,2),
    condition VARCHAR(100),
    uv_index INT,
    forecast_data JSON, -- 7-day forecast
    farming_advice JSON, -- array of advice strings
    data_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_data_date (data_date)
);

-- User notifications
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('disease_alert', 'price_update', 'scheme_update', 'weather_alert', 'general') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_type (type),
    INDEX idx_created_at (created_at)
);

-- Analytics and usage tracking
CREATE TABLE IF NOT EXISTS analytics_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    event_type VARCHAR(100) NOT NULL,
    event_data JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_event_type (event_type),
    INDEX idx_created_at (created_at)
);
