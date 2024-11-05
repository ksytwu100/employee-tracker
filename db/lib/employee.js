//This file should manage the employee table. Functions might include:
const db = require('../connect');
////Add an Employee: A function to add a new employee.

async function addEmployee(firstName, lastName, roleId, managerId) {
    const result = await db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [firstName, lastName, roleId, managerId]);
    return result.rows[0];
}
//View All Employees: A function to retrieve all employees along with their role and department.

async function getAllEmployees() {
    const res = await db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`);
    return res.rows;
}
// Get All Managers
async function getAllManagers() {
    const result = await db.query(`SELECT DISTINCT employee.first_name, employee.last_name, employee.id
        FROM employee
        JOIN employee subordinate ON employee.id = subordinate.manager_id`);
    return result.rows;
}
//Update Employee Role: A function to update an employee's role.

async function updateEmployeeRole(employeeId, newRoleId) {
    await db.query('UPDATE employee SET role_id = $1 WHERE id = $2', [newRoleId, employeeId]);
}

module.exports = { addEmployee, getAllEmployees, getAllManagers, updateEmployeeRole };