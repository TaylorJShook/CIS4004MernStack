import React from "react";

export default function AdminUsersTable({ users, currentUser, onDeleteUser }) {
  return (
    <section className="admin-table-panel">
      <h2 className="admin-table-title">Registered Users</h2>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.userNumber}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  {user._id !== currentUser._id ? (
                    <button
                      className="admin-delete-user-button"
                      onClick={() => onDeleteUser(user._id)}
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
