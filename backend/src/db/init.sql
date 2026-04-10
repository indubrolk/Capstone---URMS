CREATE DATABASE IF NOT EXISTS urms_db;
USE urms_db;

CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('Lecture Halls', 'Labs', 'Equipment', 'Vehicles') NOT NULL,
  capacity VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  status ENUM('Available', 'Booked', 'Maintenance') NOT NULL DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert dummy data
INSERT INTO resources (name, category, capacity, location, status) VALUES
('Main Auditorium', 'Lecture Halls', '500 seats', 'Block A', 'Available'),
('Mini Auditorium', 'Lecture Halls', '250 seats', 'Block B', 'Booked'),
('Z9 Hall', 'Lecture Halls', '50 seats', 'Block Z', 'Available'),
('Z8 Hall', 'Lecture Halls', '50 seats', 'Block Z', 'Available'),
('Computer Lab', 'Labs', '50 PCs', 'IT Building', 'Maintenance'),
('Multimedia Projectors', 'Equipment', '5 units', 'IT Helpdesk', 'Available'),
('Microphones', 'Equipment', '5 units', 'IT Helpdesk', 'Available'),
('Faculty Vehicle - Three-wheel', 'Vehicles', '3 seats', 'Transport Pool', 'Available'),
('Faculty Vehicle - Van', 'Vehicles', '14 seats', 'Transport Pool', 'Booked'),
('Faculty Vehicle - Car', 'Vehicles', '4 seats', 'Transport Pool', 'Available');
