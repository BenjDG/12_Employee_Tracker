const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employee_tracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "View All Employees by Manager",
                "View All Departments",
                "View All Roles",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees by Department":
                    viewAllEmployeesByDept();
                    break;

                case "View All Employees by Manager":
                    viewAllEmployeesByManager();
                    break;

                case "View All Departments":
                    viewAllDept();
                    break;

                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary
    FROM employees
    JOIN roles ON employees.role_id=roles.id
    JOIN departments ON roles.department_id=departments.id`;
    connection.query(query, function (err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}

function viewAllEmployeesByDept() {
    const query1 = `SELECT name FROM departments;`
    connection.query(query1, function (err, result) {
        if (err) throw err;
        const array = [];
        result.forEach(item=>array.push(item))
        inquirer
            .prompt({
                name: "dept",
                type: "list",
                message: "What department?",
                choices: array
            }).then(function (answer) {
                const query2 = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name, roles.salary
                FROM employees
                JOIN roles ON employees.role_id=roles.id
                JOIN departments ON roles.department_id=departments.id
                WHERE departments.name = ?`;
                console.log("answer is: " + answer.dept);
                connection.query(query2,[answer.dept], function (err, result) {
                    if (err) throw err;
                    if (result) {
                        //console.log(result);
                        console.table(result);
                        start();
                    }
                });
            })
    })
}

function viewAllDept() {
    connection.query("SELECT * FROM departments", function (err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}

function viewAllRoles() {
    connection.query("SELECT * FROM roles", function (err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}