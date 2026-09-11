const db = require("../config/db");

// =========================
// GET ALL EMPLOYEES
// =========================
const getEmployees = (req, res) => {
  const sql = "SELECT * FROM employees";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({
        message: "Failed to fetch employees",
      });
    }

    res.status(200).json(results);
  });
};


// =========================
// CREATE EMPLOYEE
// =========================
const createEmployee = (req, res) => {
  const { name, email, role, salary } = req.body;

  const sql = `
    INSERT INTO employees (name, email, role, salary)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, role, salary],
    (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({
          message: "Failed to create employee",
        });
      }

      res.status(201).json({
        message: "Employee created successfully",
        employeeId: result.insertId,
      });
    }
  );
};


// =========================
// UPDATE EMPLOYEE
// =========================
const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, role, salary } = req.body;

  const sql = `
    UPDATE employees
    SET name = ?, email = ?, role = ?, salary = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, email, role, salary, id],
    (err, result) => {
      if (err) {
        console.error("Database error:", err.message);
        return res.status(500).json({
          message: "Failed to update employee",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Employee not found",
        });
      }

      res.status(200).json({
        message: "Employee updated successfully",
      });
    }
  );
};


// =========================
// DELETE EMPLOYEE
// =========================
const deleteEmployee = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM employees WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Database error:", err.message);
      return res.status(500).json({
        message: "Failed to delete employee",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  });
};


module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};