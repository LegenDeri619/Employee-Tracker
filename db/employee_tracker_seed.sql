USE employee_tracker_db;
INSERT INTO departments (name) VALUES ('operations'),
('shipping'),
('recieving'),
('building');

INSERT INTO role (title, salary, department_id) VALUES ('manager', 100000, 1),
('manager', 60000, 2),
('manager', 60000, 3),
('manager', 60000, 4),
('team member', 30000, 2),
('team member', 30000, 3),
('team member', 30000, 4);

INSERT INTO employees (first_name, last_name, role_id) VALUES ('Kevin', 'Hart', 1),
('Wayne', 'Brady', 2),
('Allie', 'Wong', 3),
('Calos', 'Mencias', 4),
('Jo', 'Koy', 5),
('Chirs', 'Rock', 6),
('Chris', 'Tucker', 7);
