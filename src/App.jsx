import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const API_URL = "http://localhost:5001/users";

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const createUser = async () => {
    if (newUser.name && newUser.email) {
      try {
        console.log("Creating user:", newUser); 
        await axios.post(API_URL, newUser);
        fetchUsers();
        setNewUser({ name: "", email: "" });
      } catch (error) {
        console.error("Error creating user:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };
  

  const updateUser = async (id, updatedUser) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedUser);
      fetchUsers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
        Modern CRUD App
      </h1>

      {/* Add User Section */}
      <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Add User</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            className="border p-2 rounded-lg flex-1"
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="border p-2 rounded-lg flex-1"
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            onClick={createUser}
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-700">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                onClick={() => {
                  setEditUser(user);
                  setIsModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Edit User</h2>
            <input
              className="border p-2 rounded-lg w-full mb-4"
              type="text"
              placeholder="Name"
              value={editUser?.name || ""}
              onChange={(e) =>
                setEditUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <input
              className="border p-2 rounded-lg w-full mb-4"
              type="email"
              placeholder="Email"
              value={editUser?.email || ""}
              onChange={(e) =>
                setEditUser((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => updateUser(editUser.id, editUser)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
