//This file should handle the role table. Functions may include:
const db = require('../connect');
//Add a Role: A function to add a new role.

async function addRole(title, salary, departmentId) {
    const result = await db.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [title, salary, departmentId]);
    return result.rows[0];
}
//View All Roles: A function to retrieve all roles.

async function getAllRoles() {
    const result = await db.query(`
        SELECT role.id, role.title, role.salary, department.name AS department
        FROM role
        JOIN department ON role.department_id = department.id
    `);
    return result.rows;
}
//Delete a Role: A function to delete a role by ID.

async function deleteRole(id) {
    await db.query('DELETE FROM role WHERE id = $1', [id]);
}
module.exports = { addRole, getAllRoles, deleteRole };