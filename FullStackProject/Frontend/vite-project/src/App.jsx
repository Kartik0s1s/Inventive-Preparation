import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api/employees";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    salary: "",
  });

  // =========================
  // READ
  // =========================

  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);


  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // =========================
  // CREATE / UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingId ? "PUT" : "POST";

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log(data);

      // Reset form
      setFormData({
        name: "",
        email: "",
        role: "",
        salary: "",
      });

      setEditingId(null);
      setShowForm(false);

      // Refresh employees
      fetchEmployees();

    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };


  // =========================
  // EDIT
  // =========================

  const handleEdit = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name,
      email: employee.email,
      role: employee.role,
      salary: employee.salary,
    });

    setShowForm(true);
  };


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      console.log(data);

      fetchEmployees();

    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


  // =========================
  // SEARCH
  // =========================

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText) ||
      employee.role.toLowerCase().includes(searchText)
    );
  });


  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <h2>Employee Management</h2>

        <button
          className="add-btn"
          onClick={() => {
            setEditingId(null);

            setFormData({
              name: "",
              email: "",
              role: "",
              salary: "",
            });

            setShowForm(true);
          }}
        >
          + Add Employee
        </button>

      </nav>


      {/* MAIN */}

      <main className="container">

        <h1>Employees</h1>

        <p className="subtitle">
          Manage your employees from one place.
        </p>


        {/* FORM */}

        {showForm && (
          <div className="employee-form">

            <h2>
              {editingId
                ? "Edit Employee"
                : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="salary"
                placeholder="Salary"
                value={formData.salary}
                onChange={handleChange}
                required
              />

              <button type="submit">
                {editingId
                  ? "Update Employee"
                  : "Add Employee"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>

            </form>

          </div>
        )}


        {/* SEARCH */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>


        {/* TABLE */}

        <div className="employee-card">

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Actions</th>

              </tr>

            </thead>

            <tbody>

              {filteredEmployees.map((employee) => (

                <tr key={employee.id}>

                  <td>{employee.id}</td>

                  <td>{employee.name}</td>

                  <td>{employee.email}</td>

                  <td>{employee.role}</td>

                  <td>
                    ₹{employee.salary}
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(employee)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(employee.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </main>

    </div>
  );
}

export default App;
