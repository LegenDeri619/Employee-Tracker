DROP DATABASE IF EXISTS employee_tracker_db;

-- Create the database task_saver_db and specified it for use.
CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title varchar(30) NOT NULL,
  salary INT(10) NOT NULL,
  department_id VARCHAR(30) NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments (id)
	ON DELETE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE employees (
  id int NOT NULL AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NOT NULL,
  FOREIGN KEY (role_id) REFERENCES employees (id) ON DELETE CASCADE,
  PRIMARY KEY (id)
);

SELECT * FROM employees;

SELECT * FROM role;

SELECT * FROM departments;