import React from "react";

export default function AdminUsersTable({ users, currentUser, onDeleteUser }) {
  return (
    <section className="admin-table-panel">
      <h2 className="admin-table-title">Registered Users</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user.id !== currentUser.id ? (
                    <button
                      className="admin-delete-user-button"
                      onClick={() => onDeleteUser(user.id)}
                    >
                      Delete User
                    </button>
                  ) : (
                    <span className="admin-current-user-label">Current Admin</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
