import React from "react";

export default function GameForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
  return (
    <section className="admin-form-panel">
      <div className="admin-form-header">
        <div>
          <h2 className="admin-form-title">{editingId ? "Update Game" : "Add New Game"}</h2>
        </div>
      </div>

      <div className="admin-form-grid">
        <input
          className="admin-form-input"
          placeholder="Game Name"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          className="admin-form-input"
          placeholder="Genre"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
        />

        <input
          className="admin-form-input"
          placeholder="Platform"
          value={formData.platform}
          onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
        />

        <input
          className="admin-form-input admin-form-input-wide"
          placeholder="Image URL"
          value={formData.cover}
          onChange={(e) => setFormData({ ...formData, cover: e.target.value })}
        />

        <textarea
          className="admin-form-input admin-form-textarea admin-form-input-wide"
          placeholder="Short Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="admin-form-actions">
        <button onClick={onSubmit} className="admin-primary-button">
          {editingId ? "Save Changes" : "Create Game"}
        </button>
        {editingId && (
          <button onClick={onCancel} className="admin-secondary-button">
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}