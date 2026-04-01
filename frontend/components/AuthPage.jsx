import React, { useState } from "react";
import { Gamepad2 } from "lucide-react";

export default function AuthPage({ onLogin, onCreateUser, error }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(form.username, form.password);
  };

  const handleCreateUserClick = () => {
    onCreateUser(form.username, form.password);
  };

  return (
    <div className="auth-page">
      <div className="auth-single-card">
        <div className="auth-logo-block">
          <div className="auth-logo-icon">
            <Gamepad2 size={30} />
          </div>
          <h1 className="auth-logo-title">GameVerse</h1>
          <p className="auth-logo-subtitle">Your favorite game recommendation platform!</p>
        </div>

        <h2 className="auth-form-title">Login</h2>
        <p className="auth-form-subtitle">
          Sign in with an existing account, or create a new account below.
        </p>

        <form onSubmit={handleLoginSubmit} className="auth-form-fields">
          <div className="auth-field-group">
            <label className="auth-field-label">Username</label>
            <input
              className="auth-field-input"
              placeholder="Enter username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="auth-field-group">
            <label className="auth-field-label">Password</label>
            <input
              type="password"
              className="auth-field-input"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && <div className="auth-error-box">{error}</div>}

          <div className="auth-action-row">
            <button type="submit" className="auth-submit-button">
              Login
            </button>
            <button type="button" onClick={handleCreateUserClick} className="auth-create-button">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
