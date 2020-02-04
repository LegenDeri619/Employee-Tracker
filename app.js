const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_tracker_db"
});

connection.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }

    console.log("connected as id " + connection.threadId);
    startPrompt();
});

function startPrompt(){
    inquirer.prompt([
    {
        name: "action",
        type: "list",
        message: "Would you like to:",
        choices: ["add", "view", "update", "delete"]
    },
    {
        name: "option",
        type: "list",
        message: "Select an option:",
        choices: ["Departments", "Role", "Employees"]
    }]).then(res => {
        console.log(`You choose to ${res.action} the ${res.option}`);

        switch(res.action){
            case "add":
                createData(res.option);
                break;
            case "view":
                readData(res.option);
                break;
            case "update":
                updateData(res.option);
                break;
            case "delete":
                deleteData(res.option);
                break;
        }
    }).catch(res =>{
        if (err) throw err;
    })
};


function createData(option) {

    switch (option) {
        case 'Departments':
            inquirer.prompt([{
                    name: "name",
                    type: "input",
                    message: "Enter name of the new Department:",
                }, ])
                .then(res => {
                    connection.query(
                        "INSERT INTO departments SET ?", {
                            name: res.name,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log(res.affectedRows + " New department entered!\n");
                            continuePrompt()
                        }
                    );
                })
                .catch(err => {
                    console.log(err);
                })
            break;

        case 'Role':
            connection.query("SELECT * FROM departments", (err, res) => {
                if (err) throw err;

               
                const departments = res.map(object => {
                    return {
                        name: object.name,
                        value: object.id
                    }
                });

                departments.push("N/A")

                inquirer.prompt([{
                            name: "title",
                            type: "input",
                            message: "Enter title of the new role:",
                        },
                        {
                            name: "salary",
                            type: "number",
                            message: "Enter salary of the new role:",
                        },
                        {
                            name: "department_id",
                            type: "list",
                            message: "Enter employee's department?",
                            choices: departments
                        }
                    ])
                    .then(res => {
                        if (res.departments === "N/A") {
                            newDepartmentPrompt();
                        } else {
                            console.log("Entering a new role...\n");
                            connection.query(
                                "INSERT INTO role SET ?", {
                                    title: res.title,
                                    salary: res.salary,
                                    department_id: res.departments,
                                },
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(res.affectedRows + " Role entered!\n");
                                    continuePrompt()
                                }
                            );
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            });
            break;

        case 'Employees':
            
            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                const roles = res.map(object => {
                    return {
                        name: object.title,
                        value: object.id
                    }
                });
                roles.push("N/A")
                
                connection.query("SELECT * FROM employees", (err, res) => {
                    if (err) throw err;

                    var employee_list = res.map(object => {
                        return {
                            name: `${object.first_name} ${object.last_name}`,
                            value: object.id
                        }
                    });
                    employee_list.unshift({
                        name: "no manager",
                        value: null
                    })

                    
                    inquirer.prompt([{
                                name: "first_name",
                                type: "input",
                                message: "Enter employee's first name?",
                            },
                            {
                                name: "last_name",
                                type: "input",
                                message: "Enter employee's last name?",
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "Enter employee's role?",
                                choices: role
                            },
                            {
                                name: "manager",
                                type: "list",
                                message: "Enter employee's manager?",
                                choices: employees
                            },
                        ])
                        .then(res => {
                            console.log(res);
                            if (res.role === "N/A") {
                                newRolePrompt();
                            } else {
                                console.log(`Entering ${res.first_name} ${res.last_name} as a new employee...\n`);
                                console.log(res.manager)
                                connection.query(
                                    "INSERT INTO employees SET ?", {
                                        first_name: res.first_name,
                                        last_name: res.last_name,
                                        role_id: res.role,
                                        manager_id: res.manager,
                                    },
                                    (err, res) => {
                                        if (err) throw err;
                                        console.log(res.affectedRows + " employee inserted!\n");

                                        continuePrompt()
                                    }
                                );
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                });
            });
            break;

    }
};

function readData(res) {
    switch (res) {
        case "Departments":
            console.log("Selecting all departments....\n");
            connection.query("SELECT * FROM departments", (err, res) => {
                if (err) throw err;

                console.table(res);
                continuePrompt()
            });
            break;

        case "Role":
            console.log("Selecting all roles....\n");
            connection.query("SELECT * FROM role", (err, res) => {
                if (err) throw err;
                console.table(res);
                continuePrompt()
            });
            break;

        case "Employees":
            console.log("Selecting all employees....\n");
            connection.query("SELECT * FROM employees LEFT JOIN (role, departments) ON (employees.role_id = role.id AND role.department_id = departments.id)", (err, res) => {
                if (err) throw err;

                console.table(res);
                continuePrompt()
            });
            break;
    }
}

function updateData(option) {
    switch (option) {
        case 'Departments':
            console.log("Can't update department...\n");
            continuePrompt()
            break;

        case 'Role':
            console.log("Can't update role...\n");
            continuePrompt()
            break;

        case 'Employees':            
            connection.query("SELECT * FROM employees", (err, res) => {
                if (err) throw err;
                const employees = res.map(object => {
                    return {
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.employee_id
                    }
                });
                connection.query("SELECT * FROM role", (err, res) => {
                    if (err) throw err;
                    const role = res.map(object => {
                        return {
                            name: object.title,
                            value: object.role_id
                        }
                    });

                    console.log("Updating employee role....\n");
                    inquirer.prompt([{
                                name: "employee",
                                type: "list",
                                message: "Which employee's Role would you like to modify?",
                                choices: employees
                            },
                            {
                                name: "role",
                                type: "list",
                                message: "What role do you want to change to?",
                                choices: role
                            }
                        ])
                        .then(res => {
                            console.log(res.employee)
                            console.log(res.role)
                            console.log("Updating employee....\n");
                            connection.query(
                                "UPDATE employee SET ? WHERE ?",
                                [{
                                        role_id: res.role
                                    },
                                    {
                                        employee_id: res.employee
                                    }
                                ],
                                (err, res) => {
                                    if (err) throw err;
                                    console.log(res.affectedRows + " employee updated!\n");
                                    continuePrompt()
                                }
                            );
                        })
                        .catch(err => {
                            console.log(err);
                        })
                });
            });
            break;
    }
};


function deleteData(option) {
    switch (option) {
        case 'Departments':
            connection.query("SELECT * FROM departments", (err, res) => {
                if (err) throw err;
                const departments = res.map(object => {
                    return {
                        name: `${object.name}`,
                        value: object.id
                    }
                });
                inquirer.prompt([{
                        name: "department",
                        type: "list",
                        message: "Which department would you like to remove?",
                        choices: departments
                    }, ])
                    .then(res => {
                        console.log("deleting an existing department...\n");
                        connection.query(
                            "DELETE FROM departments WHERE ?",
                            [{
                                name: res.name
                            }],
                            (err, res) => {
                                if (err) throw err;
                                console.log(res.affectedRows + " department removed!\n");
                                
                                continuePrompt()
                            }
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            break;

        case 'Role':
            connection.query("SELECT * FROM role LEFT JOIN departments ON (role.department_id = departments.id)", (err, res) => {
                if (err) throw err;
                const roles = res.map(object => {
                    return {
                        title: `${object.title}`,
                        value: object.id
                    }
                });
                inquirer.prompt([{
                        name: "role",
                        type: "list",
                        message: "Which role would you like to remove?",
                        choices: roles
                    }, ])
                    .then(res => {
                        console.log("delecting an existing role...\n");
                        connection.query(
                            "DELETE FROM role WHERE ?",
                            [{
                                title: res.title
                            }],
                            (err, res) => {
                                if (err) throw err;
                                console.log(res.affectedRows + " role removed!\n");
                                
                                continuePrompt()
                            }
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            break;

        case 'Employees':
            connection.query("SELECT * FROM employee", (err, res) => {
                if (err) throw err;
                const employees = res.map(object => {
                    return {
                        name: `${object.first_name} ${object.last_name}`,
                        value: object.id
                    }
                });
                inquirer.prompt([{
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to remove?",
                        choices: employees
                    }, ])
                    .then(res => {
                        console.log("delecting an existing employee...\n");
                        connection.query(
                            "DELETE FROM employees WHERE ?",
                            [{
                                id: res.employee
                            }],
                            (err, res) => {
                                if (err) throw err;
                                console.log(res.affectedRows + " employee removed!\n");
                                
                                continuePrompt()
                            }
                        );
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })
            break;
    }
}


function continuePrompt() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "Would you like to continue or exit?",
            choices: ["Continue", "Exit"]
        })
        .then(res => {
            console.log(`${res.action}...\n`);
            switch (res.action) {
                case "Continue":
                    startPrompt();
                    break;
                case "Exit":
                    connection.end();
                    break;                
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function newDepartmentPrompt() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "Finish adding this role by creating the appropriate department.",
            choices: ["Continue", "Exit"]
        })
        .then(res => {
            console.log(`${res.action}....\n`);
            switch (res.action) {    
                case "Continue":
                    startPrompt();
                    break;
                case "Exit":
                    connection.end();
                    break;
            }
        })
        .catch(err => {
            console.log(err);
        })
}

function newRolePrompt() {
    inquirer.prompt({
            name: "action",
            type: "list",
            message: "Finish adding this employee by creating the appropriate role.",
            choices: ["Continue", "Exit"]
        })
        .then(res => {
            console.log(`${res.action}...\n`);
            switch (res.action) {
                case "Continue":
                    startPrompt();
                    break;
                case "Exit":
                    connection.end();
                    break;                
            }
        })
        .catch(err => {
            console.log(err);
        })
}