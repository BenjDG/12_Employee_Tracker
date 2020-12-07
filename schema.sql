DROP DATABASE IF EXISTS employee_tracker_DB;
CREATE DATABASE employee_tracker_DB;

USE employee_tracker_DB;
SET foreign_key_checks = 0;

CREATE TABLE employees (
id INT NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE roles (
id INT NOT NULL AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE departments (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30),
PRIMARY KEY (id)
);

SET foreign_key_checks = 1;

-- USE employee_tracker_DB;
-- SELECT * FROM employees;