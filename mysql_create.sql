CREATE DATABASE covid19 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE regions
(
    id INT PRIMARY KEY,
    name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    INDEX(name)
);

CREATE TABLE province
(
    id INT PRIMARY KEY,
    name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    abbreviation CHAR(2),
    INDEX(name)
);

CREATE TABLE cases_per_province
(
    timestamp TIMESTAMP NOT NULL,
    region_id INT NOT NULL,
    province_id INT NOT NULL,
    total_cases BIGINT NOT NULL,
    PRIMARY KEY (timestamp, region_id, province_id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    INDEX(timestamp DESC, region_id DESC, province_id DESC)
);