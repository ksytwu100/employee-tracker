const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());
const inquirer = require('inquirer');
const cTable = require("console.table");
const { addDepartment, getAllDepartments } = require('./db/lib/department');
const client = require('./db/connect');
const { getAllRoles, addRole } = require('./db/lib/role');
const { getAllEmployees, getAllManagers, addEmployee, updateEmployeeRole } = require('./db/lib/employee');

// Connect your PostgreSQL client

 client.connect();

const promptUser = async () => {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees','Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View Total Budget', 'Exit'],         
        },
    ]);
    console.log (action);
    if (action === 'View All Departments') {
                const res = await client.query('SELECT id, name FROM department');
                console.table(res.rows)
                promptUser();
                
            } else if (action === 'View All Roles') {
               const roles = await getAllRoles();
                console.table(roles);
                promptUser();
            } else if (action === 'View All Employees') {
               const employees = await getAllEmployees();
                console.table(employees);
                promptUser();
            } else if (action === 'Add Department') {
                const { departmentName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'departmentName',
                        message: 'What is the name of the department?',
                    },
                ]);
                await addDepartment(departmentName);
                promptUser();
            } else if (action === 'Add Role') {
                const departments = await getAllDepartments();
                const departmentChoices = departments.map(department => department.name);
                const { roleTitle, roleSalary, departmentName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'roleTitle',
                        message: 'What is the name of the role?',
                    },
                    {
                        type: 'input',
                        name: 'roleSalary',
                        message: 'What is the salary of the role?',
                    },
                    {
                        type: 'list',
                        name: 'departmentName',
                        message: 'Which department does the role belong to?',
                        choices: departmentChoices,
                    },
                ]);
                const departmentId = departments.find(department => department.name === departmentName).id;
                await addRole(roleTitle, roleSalary, departmentId);
                promptUser();
            }
            else if (action === 'Add Employee') {
                const roles = await getAllRoles();
                const roleChoices = roles.map(role => role.title);
                const managers = await getAllManagers();
                const managerChoices = managers.map(manager => `${manager.first_name} ${manager.last_name}`);
                const { firstName, lastName, roleTitle, managerName } = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: 'What is the first name of the employee?',
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: 'What is the last name of the employee?',
                    },
                    {
                        type: 'list',
                        name: 'roleTitle',
                        message: 'What is the employees role?',
                        choices: roleChoices,
                    },
                    {
                        type: 'list',
                        name: 'managerName',
                        message: 'What is the employee manager?',
                        choices: managerChoices,
                    },
                ]);
                const role = roles.find(role => role.title === roleTitle);
                const managerId = managers.find(manager => `${manager.first_name} ${manager.last_name}` === managerName).id;
                await addEmployee(firstName, lastName, role.id, managerId);
                promptUser();
            } else if (action === 'Update Employee Role') {
                const employees = await getAllEmployees();
                const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
                const roles = await getAllRoles();
                const roleChoices = roles.map(role => role.title);
                const { employeeName, newRoleTitle } = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: 'What employee role do you want to update?',
                        choices: employeeChoices,
                    },
                    {
                        type: 'list',
                        name: 'newRoleTitle',
                        message: 'Which role do you want to assign the selected employee?',
                        choices: roleChoices,
                    },
                ]);
                const employeeId = employees.find(employee => `${employee.first_name} ${employee.last_name}` === employeeName).id;
                const newRoleId = roles.find(role => role.title === newRoleTitle).id;
                await updateEmployeeRole(employeeId, newRoleId);
                promptUser();
            } else if (action === 'View Total Budget') { 
                const res = await client.query('SELECT SUM(role.salary) AS total_budget FROM employee JOIN role ON employee.role_id = role.id;');
                const totalBudget = parseInt(res.rows[0].total_budget).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
                console.log(`
                    ----------------------------------
                    Total Budget: ${totalBudget}
                    ---------------------------------
                    `);
                promptUser();
            } else if (action === 'Exit') {
                client.end();
            }
        };
        promptUser();


 
