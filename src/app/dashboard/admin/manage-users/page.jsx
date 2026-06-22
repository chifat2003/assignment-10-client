"use client";

import React, { useState } from "react";

const ManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", role: "user" },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", role: "lawyer" },
    { id: 3, name: "Michael Chen", email: "michael@example.com", role: "user" },
    { id: 4, name: "Jessica Martinez", email: "jessica@example.com", role: "lawyer" },
    { id: 5, name: "David Lee", email: "david@example.com", role: "user" },
    { id: 6, name: "Emily Wilson", email: "emily@example.com", role: "admin" },
    { id: 7, name: "Robert Taylor", email: "robert@example.com", role: "lawyer" },
    { id: 8, name: "Patricia Brown", email: "patricia@example.com", role: "user" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const handleChangeRole = (id, currentRole) => {
    setEditingId(id);
    setNewRole(currentRole);
  };

  const handleSaveRole = (id) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    setEditingId(null);
  };

  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return { bg: "rgba(239, 68, 68, 0.2)", color: "#ef4444" };
      case "lawyer":
        return { bg: "rgba(139, 92, 246, 0.2)", color: "#c084fc" };
      case "user":
        return { bg: "rgba(59, 130, 246, 0.2)", color: "#60a5fa" };
      default:
        return { bg: "rgba(107, 114, 128, 0.2)", color: "#9ca3af" };
    }
  };

  return (
    <div style={{ padding: "24px", width: "100%" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#ffffff", margin: "0 0 8px 0" }}>
          Manage Users
        </h1>
        <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
          View, edit roles, and manage user accounts ({users.length} total)
        </p>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          border: "1px solid #3b4256",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #3b4256" }}>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "left",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Current Role
                </th>
                <th
                  style={{
                    padding: "16px 20px",
                    textAlign: "center",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => {
                const roleColor = getRoleColor(user.role);
                return (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: index !== users.length - 1 ? "1px solid #3b4256" : "none",
                      backgroundColor: index % 2 === 0 ? "transparent" : "rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#e5e7eb", fontWeight: "500" }}>
                      {user.name}
                    </td>
                    <td style={{ padding: "16px 20px", fontSize: "13px", color: "#9ca3af" }}>{user.email}</td>
                    <td style={{ padding: "16px 20px", fontSize: "13px" }}>
                      {editingId === user.id ? (
                        <select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value)}
                          style={{
                            background: "rgba(0, 0, 0, 0.3)",
                            border: "1px solid #3b82f6",
                            borderRadius: "6px",
                            padding: "6px 10px",
                            color: "#ffffff",
                            fontSize: "12px",
                          }}
                        >
                          <option value="user">User</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          style={{
                            background: roleColor.bg,
                            color: roleColor.color,
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "500",
                            textTransform: "capitalize",
                          }}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      {editingId === user.id ? (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleSaveRole(user.id)}
                            style={{
                              background: "#10b981",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              background: "#6b7280",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleChangeRole(user.id, user.role)}
                            style={{
                              background: "#3b82f6",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = "#2563eb")}
                            onMouseLeave={(e) => (e.target.style.background = "#3b82f6")}
                          >
                            Change Role
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            style={{
                              background: "#ef4444",
                              color: "#ffffff",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = "#dc2626")}
                            onMouseLeave={(e) => (e.target.style.background = "#ef4444")}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          table {
            font-size: 12px;
          }
          table td, table th {
            padding: 12px 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;
