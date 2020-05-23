 DROP DATABASE IF EXISTS employee_trackerdb;

CREATE DATABASE employee_trackerdb;

USE employee_trackerdb;

CREATE TABLE employees (
    id INT AUTO_INCREMET PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT(10),
    manager_id INT(10)
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
