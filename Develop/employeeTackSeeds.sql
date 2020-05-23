INSERT INTO employees (first_name,last_name,role_id,manager_id)
VALUES ("Nick","Tavarez",1,2), ("Ellen","Willson",2,1),("Sammy","Hereson",3,2);

SELECT * FROM employees;

INSERT INTO roles (title,salary,department_id)
VALUES ("Manager",200,1), ("Lawyer",400,2), ("Intern",10,3);

SELECT * FROM roles;

INSERT INTO department (name)
VALUES ('Administration'), ("Criminal"), ('Education')

SELECT * FROM department;