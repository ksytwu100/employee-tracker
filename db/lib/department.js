//Create a Department: A function to add a new department to the database.
const db = require('../connect');
async function addDepartment(name) {
    const result = await db.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [name]);
    return result.rows[0];
}
//View All Departments: A function to retrieve all departments.

async function getAllDepartments() {
    const result = await db.query('SELECT * FROM department');
    return result.rows;
}
//Delete a Department: A function to delete a department by ID.

async function deleteDepartment(id) {
    await db.query('DELETE FROM department WHERE id = $1', [id]);
}
module.exports = { addDepartment, getAllDepartments, deleteDepartment };