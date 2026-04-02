import React from "react";

export default function TopBar({ currentUser }) {
  return (
    <header className="topbar-panel">
      <div>
        <h1 className="topbar-title">
          {currentUser.role === "admin" ? "Administrator Panel" : "Recommended Games"}
        </h1>
      </div>

      <div
        className={`topbar-role-pill ${
          currentUser.role === "admin" ? "topbar-role-admin" : "topbar-role-standard"
        }`}
      >
        {currentUser.role === "admin" ? "Administrator" : "Standard User"}
      </div>
    </header>
  );
}
