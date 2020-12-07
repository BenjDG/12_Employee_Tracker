USE employee_tracker_db;
INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES 
   ('Bob', 'Christmas', 1, NULL),
   ('Dan', 'Fraser', 2, 1),
   ('Frodo', 'Baggins', 3, 2),
   ('Tom', 'Anderson', 4, 3),
   ('Linda', 'Brown', 5 ,2),
   ('Gwen', 'Stacy', 6, 5),
   ('Phil', 'Coulson', 7, 2),
   ('Hank', 'Pym', 8, 7);

INSERT INTO departments(name)
VALUES
   ('Administration'),
   ('Sales'),
   ('Accounting'),
   ('Engineering');

INSERT INTO roles(title, salary, department_id)
   VALUES
   ('CEO', 1000000, 1),
   ('COO', 500000, 1),
   ('Sr. Account Manager', 300000, 2),
   ('Jr. Account Manager', 100000, 2),
   ('Sr. Accountant', 90000, 3),
   ('Jr. Accountant', 60000, 3),
   ('Sr. Engineer', 150000, 4),
   ('Jr. Engineer', 75000, 4);

   