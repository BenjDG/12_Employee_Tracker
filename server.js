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
                "Add New Employee",
                "Add New Role",
                "Add New Department",
                "Update Employee Role",
                "Update Employee Manager",
                "Update Roles",
                "Update Department",
                "Delete Employee",
                "Delete Role",
                "Delete Department",
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
                case "Add New Employee":
                    addEmployee();
                    break;
                case "Add New Role":
                    addRole();
                    break;
                case "Add New Department":
                    addDept();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "Update Roles":
                    updateRoles();
                    break;
                case "Update Department":
                    updateDeptartment();
                    break;
                case "Delete Employee":
                    deleteEmp();
                    break;
                case "Delete Role":
                    deleteRole();
                    break;
                case "Delete Department":
                    deleteDept();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        });
}

function viewAllEmployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary
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
        result.forEach(item => array.push(item))
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
                connection.query(query2, [answer.dept], function (err, result) {
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

function viewAllEmployeesByManager() {
    const query1 = `SELECT DISTINCT mgr.id AS employee_id, mgr.first_name AS manager_first_name, mgr.last_name AS manager_last_name
    FROM employees AS emp, employees AS mgr
    WHERE emp.manager_id=mgr.id;`
    connection.query(query1, function (err, result) {
        if (err) throw err;
        const array = [];
        result.forEach(item => array.push(`${item.employee_id} ${item.manager_first_name} ${item.manager_last_name}`))
        inquirer
            .prompt({
                name: "mngr",
                type: "list",
                message: "What manager?",
                choices: array
            }).then(function (answer) {
                const idNumber = answer.mngr.split(" ");
                const query2 = `SELECT employees.first_name, employees.last_name
                FROM employees
                WHERE employees.manager_id = ?;`;
                console.log("answer is: " + idNumber[0]);
                connection.query(query2, [idNumber[0]], function (err, result) {
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

function addEmployee() {
    inquirer
        .prompt([{
            name: "newEmpFirst",
            type: "input",
            message: "What is the employees first name?",
            validate: nameValidator
        },
        {
            name: "newEmpLast",
            type: "input",
            message: "What is the employees last name?",
            validate: nameValidator
        }
        ])
        .then(function (answer) {
            console.log(answer);
        })
    //connection.query(){}
}

function nameValidator(name) {
    console.log(`You entered: ${name}`);
    const nameRGEX = /^[a-zA-Z]+$/g;
    const result = nameRGEX.test(name);
    console.log(`result is ${result}`);
    if (result) {return true;}
    else {return "Only use letters, no spaces.";}
}