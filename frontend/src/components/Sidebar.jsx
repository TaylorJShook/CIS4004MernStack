import React from "react";
import { Gamepad2, Shield, User } from "lucide-react";

export default function Sidebar({ currentUser, view, setView, onLogout }) {
  const adminItems = ["home", "manage-games", "manage-users", "reports"];
  const standardItems = ["home", "my-ratings", "profile"];
  const items = currentUser.role === "admin" ? adminItems : standardItems;

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Gamepad2 size={24} />
        </div>
        <div>
          <div className="sidebar-brand-name">GameVerse</div>
          <div className="sidebar-brand-subtitle">Recommendation Hub</div>
        </div>
      </div>

      <div className="sidebar-user-card">
        <div className="sidebar-user-icon">
          {currentUser.role === "admin" ? <Shield size={20} /> : <User size={20} />}
        </div>
        <div>
          <p className="sidebar-user-name">{currentUser.username}</p>
          <p className="sidebar-user-role">{currentUser.role}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => setView(item)}
            className={`sidebar-nav-button ${view === item ? "sidebar-nav-active" : ""}`}
          >
            {item.replace("-", " ")}
          </button>
        ))}
      </nav>

      <button onClick={onLogout} className="sidebar-logout-button">
        Logout
      </button>
    </aside>
  );
}
