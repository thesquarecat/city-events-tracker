-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS EventCategory CASCADE;
DROP TABLE IF EXISTS UserCategorySub CASCADE;
DROP TABLE IF EXISTS UserAreaSub CASCADE;
DROP TABLE IF EXISTS Event CASCADE;
DROP TABLE IF EXISTS Venue CASCADE;
DROP TABLE IF EXISTS Category CASCADE;
DROP TABLE IF EXISTS Area CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS Role CASCADE;

-- Role
CREATE TABLE Role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- User
CREATE TABLE "User" (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    role_id INT NOT NULL REFERENCES Role(role_id)
);

-- Area
CREATE TABLE Area (
    area_id SERIAL PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL UNIQUE
);

-- Venue
CREATE TABLE Venue (
    venue_id SERIAL PRIMARY KEY,
    venue_name VARCHAR(150) NOT NULL,
    address_text VARCHAR(255),
    area_id INT NOT NULL REFERENCES Area(area_id)
);

-- Category
CREATE TABLE Category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE
);

-- Event
CREATE TABLE Event (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled','cancelled','completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by INT NOT NULL REFERENCES "User"(user_id),
    area_id INT NOT NULL REFERENCES Area(area_id),
    venue_id INT REFERENCES Venue(venue_id)
);

-- EventCategory
CREATE TABLE EventCategory (
    event_id INT NOT NULL REFERENCES Event(event_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES Category(category_id),
    PRIMARY KEY (event_id, category_id)
);

-- UserAreaSub
CREATE TABLE UserAreaSub (
    user_id INT NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    area_id INT NOT NULL REFERENCES Area(area_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, area_id)
);

-- UserCategorySub
CREATE TABLE UserCategorySub (
    user_id INT NOT NULL REFERENCES "User"(user_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES Category(category_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, category_id)
);

-- Roles
INSERT INTO Role (role_name) VALUES
('admin'),
('user');

-- Areas
INSERT INTO Area (area_name) VALUES
('Tempe'),
('Phoenix'),
('Scottsdale');

-- Categories
INSERT INTO Category (category_name) VALUES
('Concert'),
('Road Closure'),
('Festival');

-- Users
INSERT INTO "User" (username, email, password, role_id) VALUES
('alice', 'alice@example.com', 'pass', 1),
('bob', 'bob@example.com', 'pass', 2),
('charlie', 'charlie@example.com', 'pass', 2);

-- Venues
INSERT INTO Venue (venue_name, address_text, area_id) VALUES
('Mill Avenue', '123 Mill Ave', 1),
('Phoenix Center', '456 Central Ave', 2);

-- Events
INSERT INTO Event (
    title, description, start_datetime, end_datetime, status, created_by, area_id, venue_id
) VALUES
('Music Festival', 'Live music event', NOW(), NOW() + INTERVAL '1 day', 'scheduled', 1, 1, 1),
('Road Closure', 'Street maintenance', NOW(), NOW() + INTERVAL '2 days', 'scheduled', 1, 2, NULL),
('Downtown Concert', 'Outdoor concert in downtown Phoenix',
 NOW() + INTERVAL '2 days',
 NOW() + INTERVAL '2 days 5 hours',
 'scheduled', 1, 2, 2);

-- Event categories
INSERT INTO EventCategory (event_id, category_id) VALUES
(1, 1),
(1, 3),
(2, 2),
(3, 1);

-- User area subscriptions
INSERT INTO UserAreaSub (user_id, area_id) VALUES
(2, 1),
(3, 2);

-- User category subscriptions
INSERT INTO UserCategorySub (user_id, category_id) VALUES
(2, 1),
(3, 2);
