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
                "View All Roles"
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
            }
        });
}

function viewAllEmployees() {
    connection.query("SELECT * FROM employees", function(err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}

function viewAllDept(); {
    connection.query("SELECT * FROM departments", function(err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}

function viewAllRoles(); {
    connection.query("SELECT * FROM roles", function(err, result) {
        if (err) throw err;
        if (result) {
            //console.log(result);
            console.table(result);
            start();
        }
    });
}