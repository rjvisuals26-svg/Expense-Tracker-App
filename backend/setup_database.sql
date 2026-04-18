CREATE DATABASE IF NOT EXISTS `beautify petals_db`;
USE `beautify petals_db`;

-- Task 4: Transactions table (Updated to match screenshot and insights requirements)
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  amount DECIMAL(10,2),
  category VARCHAR(100),
  type VARCHAR(20),
  date VARCHAR(50), -- Needed for monthly grouping in charts (e.g., 'Apr 08')
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA
INSERT INTO transactions (title, amount, category, type, date) VALUES
('Monthly Salary', 135000.00, 'Salary', 'income', 'Apr 08'),
('Imtiaz Store Grocery', 18450.00, 'Food', 'expense', 'Apr 08'),
('Electricity Bill (KE)', 22300.00, 'Housing', 'expense', 'Apr 07'),
('Freelance Upwork', 45000.00, 'Work', 'income', 'Apr 06'),
('Fuel Refill (Shell)', 6500.50, 'Others', 'expense', 'Apr 06'),
('Gym Membership', 5500.00, 'Health', 'expense', 'Apr 05'),
('Internet Bill (Storm)', 4500.00, 'Housing', 'expense', 'Apr 01');
