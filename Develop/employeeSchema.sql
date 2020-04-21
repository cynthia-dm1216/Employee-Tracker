 DROP DATABASE IF EXISTS employee_tackerDB;

CREATE DATABASE employee_tackerDB;

USE employee_tackerDB;

CREATE TABLE employees (
    id INT AUTO_INCREMET PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10) NULL
);

CREATE TABLE department (
    id INT AUTO_INCREMET PRIMARY KEY,
    name VARCHAR(30),
);

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(30.3),
    department_id INT(10)
);

SELECT * FROM employees;
SELECT * FROM roles;
SELECT * FROM department;