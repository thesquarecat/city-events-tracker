# City Events Tracker

CSE412 Final Project

## Features

- View all city events
- Personalized feed
- Admin dashboard (add / update / delete events)

## Tech Stack

- Next.js
- PostgreSQL
- Tailwind CSS
- Node.js

## Requirements

Install these first:

- Node.js (LTS)
- PostgreSQL
- Git

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/thesquarecat/city-events-tracker.git
cd city-events-tracker

### 2. Install Dependencies
npm install
### 3. Create Environment File

Copy .env.example to .env.local

Example:

DB_USER=cityapp
DB_PASSWORD=citypass
DB_HOST=localhost
DB_NAME=cse412_midterm
DB_PORT=5432
### 4. Create PostgreSQL Database

Using pgAdmin or psql:

CREATE DATABASE cse412_midterm;
### 5. Import SQL Setup File
psql -U postgres -d cse412_midterm -f sql/schema_and_data.sql

### 6. Create App User
CREATE USER cityapp WITH PASSWORD 'citypass';
GRANT ALL PRIVILEGES ON DATABASE cse412_midterm TO cityapp;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cityapp;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cityapp;

### 7. Start App
npm run dev

Open:

http://localhost:3000

Pages
/ Events page
/feed Personalized feed
/admin Admin dashboard
Notes

If cityapp already exists:

ALTER USER cityapp WITH PASSWORD 'citypass';
Linux Specific Notes:
If using Linux and PostgreSQL service is stopped:

sudo systemctl start postgresql
