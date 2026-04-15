CREATE DATABASE IF NOT EXISTS urms_db;
USE urms_db;

CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT 'Lecture Halls',
  capacity VARCHAR(100) NOT NULL DEFAULT '0',
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data (only if table is empty)
INSERT INTO resources (name, category, capacity, location, status)
SELECT * FROM (SELECT
  'Main Auditorium' AS name, 'Lecture Halls' AS category, '500' AS capacity, 'Block A' AS location, 'Available' AS status
) AS tmp WHERE NOT EXISTS (SELECT 1 FROM resources LIMIT 1);

-- Or just run these inserts once manually:
-- INSERT INTO resources (name, category, capacity, location, status) VALUES
-- ('Main Auditorium', 'Lecture Halls', '500', 'Block A', 'Available'),
-- ('Mini Auditorium', 'Lecture Halls', '250', 'Block B', 'Booked'),
-- ('Z9 Hall', 'Lecture Halls', '50', 'Block Z', 'Available'),
-- ('Z8 Hall', 'Lecture Halls', '50', 'Block Z', 'Available'),
-- ('Lab 01', 'Labs', '60', 'IT Building', 'Available'),
-- ('Lab 03', 'Labs', '45', 'IT Building', 'Booked'),
-- ('Room 204', 'Rooms', '30', 'Block B', 'Available'),
-- ('Hall A', 'Lecture Halls', '150', 'Block A', 'Booked'),
-- ('Multimedia Projectors', 'Equipment', '5', 'IT Helpdesk', 'Available'),
-- ('Faculty Vehicle - Van', 'Vehicles', '14', 'Transport Pool', 'Booked');
