USE employee_tracker_db;
INSERT INTO employees(first_name, last_name)
VALUES 
   ('Bob', 'Christmas'),
   ('Dan', 'Fraser'),
   ('Frodo', 'Baggins'),
   ('Tom', 'Anderson'),
   ('Linda', 'Brown'),
   ('Gwen', 'Stacy'),
   ('Phil', 'Coulson'),
   ('Hank', 'Pym');

INSERT INTO departments(name)
VALUES
   ('Administration'),
   ('Sales'),
   ('Accounting'),
   ('Engineering');

INSERT INTO roles(title, salary)
   VALUES
   ('CEO', 1000000),
   ('COO', 500000),
   ('Sr. Account Manager', 300000),
   ('Jr. Account Manager', 100000),
   ('Sr. Accountant', 90000),
   ('Jr. Accountant', 60000),
   ('Sr. Engineer', 150000),
   ('Jr. Engineer', 75000);