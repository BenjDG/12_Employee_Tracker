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
                    updateDept();
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
    //Get list of emp for mgr selection
    const queryEmp = `SELECT id, first_name, last_name
    FROM employees;`;
    const arrayEmp = [];
    connection.query(queryEmp, function (err, results) {
        if (err) throw err;
        if (results) {
            //console.log("Employees: ");
            //console.dir(results);
            results.forEach(item => arrayEmp.push(`${item.id} ${item.first_name} ${item.last_name}`))
            arrayEmp.push("None");
        }
        //console.log(arrayEmp);
    })


    //Get list of roles for selection
    const queryRoles = `SELECT id, title
    FROM roles;`;
    const arrayRoles = [];
    connection.query(queryRoles, function (err, results) {
        if (err) throw err;
        if (results) {
            //console.log("Roles: ");
            //console.dir(results);
            results.forEach(item => arrayRoles.push(`${item.id} ${item.title}`))
        }
        //console.log(arrayRoles);
    })

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
        },
        {
            name: "selectMgr",
            type: "list",
            message: "Select a manager for this employee",
            choices: arrayEmp
        },
        {
            name: "selectRole",
            type: "list",
            message: "Select a Role:",
            choices: arrayRoles
        }

        ])
        .then(function (answer) {
            //console.log(answer);

            const mgr = answer.selectMgr.split(" ");
            const role = answer.selectRole.split(" ");


            if (mgr[0] === "None") {
                console.log(`None was hit ${mgr}`);
                const query = `INSERT INTO employees(first_name, last_name, role_id)
                VALUES (?, ?, ?)`;
                const data = [answer.newEmpFirst, answer.newEmpLast, +role[0]]
                connection.query(query, data, function (err, result) {
                    if (err) throw err;
                    if (result) {
                        console.log(`Data saved!`);
                        start();
                    }
                });

            } else {
                const query = `INSERT INTO employees(first_name, last_name, role_id, manager_id)
                VALUES (?, ?, ?, ?)`;
                const data = [answer.newEmpFirst, answer.newEmpLast, +role[0], +mgr[0]];
                connection.query(query, data, function (err, result) {
                    if (err) throw err;
                    if (result) {
                        console.log(`Data saved!`);
                        start();
                    }
                });
            }
        });
}

function addRole() {
    const queryDept = `SELECT * FROM departments;`;
    const deptArray = [];
    connection.query(queryDept, function (err, results) {
        if (err) throw err;
        if (results) {
            console.dir(results);
            results.forEach(item => deptArray.push(`${item.id} ${item.name}`))
        }

    });
    //console.log(`dept Array: ${deptArray}`);
    inquirer
        .prompt([{
            name: "newRoleTitle",
            type: "input",
            message: "What is the title of the new role?",
            validate: nameValidator
        },
        {
            name: "newSalary",
            type: "input",
            message: "What is the salary amount for the new role?",
            validate: numValidator
        },
        {
            name: "selectDept",
            type: "list",
            message: "Select a department for this new role:",
            choices: deptArray
        }
        ])
        .then(function (answer) {
            console.dir(answer);
            const dept = answer.selectDept.split(" ");
            const query = `INSERT INTO roles(title, salary, department_id)
            VALUES (?, ?, ?)`;
            const data = [answer.newRoleTitle, answer.newSalary, dept[0]];
            connection.query(query, data, function (err, result) {
                if (err) throw err;
                if (result) {
                    console.log(`Data saved!`);
                    start();
                }
            });
        })
}

function addDept() {
    inquirer
        .prompt([{
            name: "newDeptName",
            type: "input",
            message: "What is the name of the new department?",
            validate: nameValidator
        }
        ])
        .then(function (answer) {
            const data = [answer.newDeptName]

            connection.query(`INSERT INTO departments(name)
            VALUES (?)`, [answer.newDeptName], function (err, result) {
                if (err) throw err;
                if (result) {
                    console.log(`Data saved!`);
                    start();
                }
            })
        })
}

function updateEmployeeRole() {
    const queryRole = `SELECT id, title FROM roles;`;
    const arrayRole = [];
    connection.query(queryRole, function (err, results) {
        if (err) throw err;
        if (results) {
            results.forEach(value => arrayRole.push(`${value.id} ${value.title}`));
        }
    });
    const queryEmp = `SELECT employees.id, employees.first_name, employees.last_name, roles.title
    FROM employees
    JOIN roles ON employees.role_id=roles.id;`;
    const arrayEmp = [];
    connection.query(queryEmp, function (err, results) {
        if (err) throw err;
        if (results) {
            results.forEach(item => arrayEmp.push(`${item.id} ${item.first_name} ${item.last_name} ${item.title}`));
            inquirer
                .prompt([{
                    name: "selectEmp",
                    type: "list",
                    message: "Select an employee to update:",
                    choices: arrayEmp
                },
                {
                    name: "selectRole",
                    type: "list",
                    message: "Select new role:",
                    choices: arrayRole
                }
                ])
                .then(function (answer) {
                    const emp = answer.selectEmp.split(" ");
                    const role = answer.selectRole.split(" ");
                    const queryUpdateRole = `UPDATE employees
                        SET role_id = ?
                        WHERE id = ?;`;
                    connection.query(queryUpdateRole, [role[0], emp[0]], function (err, result) {
                        if (err) throw err;
                        if (result) {
                            console.log(`Data saved!`);
                            start();
                        }
                    });
                });
        }
    });
}

function updateEmployeeManager() {
    const queryMgr = `SELECT id, first_name, last_name
    FROM employees;`;
    const arrayMgr = [];
    connection.query(queryMgr, function (err, result) {
        if (err) throw err;
        result.forEach(item => arrayMgr.push(`${item.id} ${item.first_name} ${item.last_name}`))
    });
    const queryEmp = `SELECT emp.id, emp.first_name, emp.last_name, mgr.first_name AS manager_first_name, mgr.last_name AS manager_last_name
    FROM employees AS emp, employees AS mgr
    WHERE emp.manager_id=mgr.id;`;
    connection.query(queryEmp, function (err, result) {
        if (err) throw err;
        const arrayEmp = [];
        result.forEach(item => arrayEmp.push(`${item.id} ${item.first_name} ${item.last_name} ${item.manager_first_name} ${item.manager_last_name}`))
        inquirer
            .prompt([{
                name: "emp",
                type: "list",
                message: "Select the employee to update: ",
                choices: arrayEmp
            },
            {
                name: "newMgr",
                type: "list",
                message: "Select the employee's new manager: ",
                choices: arrayMgr
            }
            ])
            .then(function (answer) {
                const empId = answer.emp.split(" ");
                const mgrId = answer.newMgr.split(" ");
                const queryUpdateMgr = `UPDATE employees
                SET manager_id = ?
                WHERE id = ?;`;
                connection.query(queryUpdateMgr, [mgrId[0], empId[0]], function (err, result) {
                    if (err) throw err;
                    if (result) {
                        console.log(`Data saved!`);
                        start();
                    }
                })
            })
    })
}

function updateRoles() {
    const rolesArr = [];
    connection.query("SELECT id, title, salary FROM roles;", function (err, result) {
        if (err) throw err;
        if (result) {
            result.forEach(i => rolesArr.push(`${i.id} ${i.title} ${i.salary}`))
            inquirer
                .prompt([{
                    name: "selectRole",
                    type: "list",
                    message: "Select a role to update:",
                    choices: rolesArr
                },
                {
                    name: "updateTitle",
                    type: "input",
                    message: "What is the updated title?",
                    validate: titleValidator
                },
                {
                    name: "updateSalary",
                    type: "input",
                    message: "Enter an updated salary number:",
                    validate: numValidator
                }
                ])
                .then(function (answer) {
                    //console.dir(answer);
                    const roleId = answer.selectRole.split(" ");
                    const query = `UPDATE roles
                    SET title = ?, salary = ? 
                    WHERE id = ?;`;
                    connection.query(query, [answer.updateTitle, answer.updateSalary, roleId[0]], function (err, result) {
                        if (err) throw err;
                        if (result) {
                            console.log(`Data saved!`);
                            start();
                        }
                    })
                })
        }
    });
}

function updateDept() {
    const queryDpt = `SELECT id, name FROM departments;`;
    const dptArray = [];
    connection.query(queryDpt, function (err, result) {
        if (err) throw err;
        if (result) {
            result.forEach(i => dptArray.push(`${i.id} ${i.name}`))
        }
        inquirer
            .prompt([{
                name: "selectDpt",
                type: "list",
                message: "Select a department name to update:",
                choices: dptArray
            },
            {
                name: "updateDpt",
                type: "input",
                message: "What is the updated department name?",
                validate: titleValidator
            }
            ])
            .then(function (answer) {
                //console.dir(answer);
                //console.log(`new value: ${answer.updateDpt}`);
                const selectId = answer.selectDpt.split(" ");
                //console.log(`selectId: ${selectId}`);
                const queryUpdateDpt = `UPDATE departments
            SET name = ?
            WHERE id = ?;`;
                connection.query(queryUpdateDpt, [answer.updateDpt, selectId[0]], function (err, result) {
                    if (err) throw err;
                    if (result) {
                        console.log(`Data saved!`);
                        start();
                    }
                })
            })
    })
}

function deleteEmp() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, roles.title
    FROM employees
    JOIN roles ON employees.role_id=roles.id;`;
    const arrayEmp = [];
    connection.query(query, function (err, result) {
        if (err) throw err;
        if (result) {
            result.forEach(item => arrayEmp.push(`${item.id} ${item.first_name} ${item.last_name} ${item.title}`));
            inquirer
                .prompt([{
                    name: "selectEmp",
                    type: "list",
                    message: "Select an employee to Delete:",
                    choices: arrayEmp
                },
                {
                    name: "confirmSelect",
                    type: "confirm",
                    message: "Are you sure?"
                }
                ])
                .then(function (answer) {
                    const emp = answer.selectEmp.split(" ");
                    const queryDelete = `DELETE FROM employees WHERE id = ?;`
                    if (answer.confirmSelect) {
                        connection.query(queryDelete, [emp[0]], function(err, result) {
                            if (err) throw err;
                            if (result) {
                                console.log(`Employee Deleted`);
                                start();
                            }
                        })
                    } else {
                        console.log(`Record not deleted.`);
                        start();
                    }
                })
        }
    })
}

function deleteRole() {
    const query = `SELECT id, title FROM roles;`;
    const arrayRoles = [];
    connection.query(query, function (err, result) {
        if (err) console.error(`Unable to delete.`);
        if (result) {
            result.forEach(item => arrayRoles.push(`${item.id} ${item.title}`));
            inquirer
                .prompt([{
                    name: "selectRole",
                    type: "list",
                    message: "Select a role to Delete:",
                    choices: arrayRoles
                },
                {
                    name: "confirmSelect",
                    type: "confirm",
                    message: "Are you sure?"
                }
                ])
                .then(function (answer) {
                    const roleId = answer.selectRole.split(" ");
                    const queryDelete = `DELETE FROM roles WHERE id = ?;`
                    if (answer.confirmSelect) {
                        connection.query(queryDelete, [roleId[0]], function(err, result) {
                            if (err) throw err;
                            if (result) {
                                console.log(`Role Deleted`);
                                start();
                            }
                        })
                    } else {
                        console.log(`Record not deleted.`);
                        start();
                    }
                })
        }
    })
}

function deleteDept() {
        const query = `SELECT id, name FROM departments;`;
        const arrayDpt = [];
        connection.query(query, function (err, result) {
            if (err) throw err;
            if (result) {
                result.forEach(item => arrayDpt.push(`${item.id} ${item.name}`));
                inquirer
                    .prompt([{
                        name: "selectDpt",
                        type: "list",
                        message: "Select a department to Delete:",
                        choices: arrayDpt
                    },
                    {
                        name: "confirmSelect",
                        type: "confirm",
                        message: "Are you sure?"
                    }
                    ])
                    .then(function (answer) {
                        const dptId = answer.selectDpt.split(" ");
                        const queryDelete = `DELETE FROM departments WHERE id = ?;`
                        if (answer.confirmSelect) {
                            connection.query(queryDelete, [dptId[0]], function(err, result) {
                                if (err) throw err;
                                if (result) {
                                    console.log(`Department Deleted`);
                                    start();
                                }
                            })
                        } else {
                            console.log(`Record not deleted.`);
                            start();
                        }
                    })
            }
        })
}



function nameValidator(name) {
    const nameRGEX = /^[a-zA-Z]+$/g;
    const result = nameRGEX.test(name);
    if (result) { return true; }
    else { return "Only use letters, no spaces."; }
}

function numValidator(num) {
    const numRGEX = /^[0-9]+$/g;
    const result = numRGEX.test(num);
    if (result) { return true; }
    else { return "Only use numbers, no spaces."; }
}

function titleValidator(title) {
    const titleRGEX = /^[a-zA-Z.\s]+$/g;
    const result = titleRGEX.test(title);
    if (result) { return true; }
    else { return "Only use numbers, spaces, or periods."; }
}