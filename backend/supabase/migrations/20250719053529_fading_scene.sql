-- Insert initial users
INSERT INTO users (username, email, password, first_name, last_name, role, enabled, created_at, updated_at) 
VALUES 
('admin', 'admin@taskmanager.com', '$2a$10$dXJ3SW6G7P6MuIxXyaRxQu8nGg5z25S.BhWgXzOYNDqPjKaY2K7K2', 'Admin', 'User', 'ADMIN', true, NOW(), NOW()),
('manager', 'manager@taskmanager.com', '$2a$10$dXJ3SW6G7P6MuIxXyaRxQu8nGg5z25S.BhWgXzOYNDqPjKaY2K7K2', 'Manager', 'User', 'MANAGER', true, NOW(), NOW()),
('user1', 'user1@taskmanager.com', '$2a$10$dXJ3SW6G7P6MuIxXyaRxQu8nGg5z25S.BhWgXzOYNDqPjKaY2K7K2', 'John', 'Doe', 'USER', true, NOW(), NOW()),
('user2', 'user2@taskmanager.com', '$2a$10$dXJ3SW6G7P6MuIxXyaRxQu8nGg5z25S.BhWgXzOYNDqPjKaY2K7K2', 'Jane', 'Smith', 'USER', true, NOW(), NOW());

-- Insert initial projects
INSERT INTO projects (name, description, status, owner_id, created_at, updated_at)
VALUES 
('Enterprise Web Application', 'Development of the main enterprise web application', 'IN_PROGRESS', 2, NOW(), NOW()),
('Mobile App Development', 'Cross-platform mobile application development', 'PLANNING', 2, NOW(), NOW()),
('Database Migration', 'Migration of legacy database to new system', 'COMPLETED', 1, NOW(), NOW());

-- Insert initial tasks
INSERT INTO tasks (title, description, status, priority, due_date, assignee_id, creator_id, project_id, created_at, updated_at)
VALUES 
('Setup Authentication System', 'Implement JWT-based authentication for the application', 'IN_PROGRESS', 'HIGH', '2025-02-15 10:00:00', 3, 2, 1, NOW(), NOW()),
('Design Database Schema', 'Create comprehensive database schema for the application', 'DONE', 'MEDIUM', '2025-01-30 16:00:00', 4, 2, 1, NOW(), NOW()),
('Implement User Management', 'Create user registration, login, and profile management features', 'TODO', 'HIGH', '2025-02-20 12:00:00', 3, 2, 1, NOW(), NOW()),
('Mobile UI Design', 'Design responsive UI components for mobile application', 'TODO', 'MEDIUM', '2025-03-01 14:00:00', 4, 2, 2, NOW(), NOW()),
('API Integration', 'Integrate backend APIs with mobile application', 'TODO', 'HIGH', '2025-03-15 11:00:00', 3, 2, 2, NOW(), NOW());