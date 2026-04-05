import React from "react";

// cahanged - now accepts genereList and platformsList from DB to render aschekcboxes
export default function GameForm({ formData, setFormData, onSubmit, editingId, onCancel, genresList, platformsList }) {
  const toggleId = (field, id) => {
    setFormData((prev) => {
      const list = prev[field];
      return {
        ...prev,
        [field]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
      };
    });
  };

  return (
    <section className="admin-form-panel">
      <div className="admin-form-header">
        <h2 className="admin-form-title">{editingId ? "Update Game" : "Add New Game"}</h2>
      </div>

      <div className="admin-form-grid">
        <input
          className="admin-form-input"
          placeholder="Game Name"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <input
          className="admin-form-input admin-form-input-wide"
          placeholder="Image URL"
          value={formData.coverImageUrl}
          onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
        />

        <textarea
          className="admin-form-input admin-form-textarea admin-form-input-wide"
          placeholder="Short Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />

        {genresList.length > 0 && (
          <div className="admin-form-input-wide">
            <p className="admin-form-label">Genres</p>
            <div className="admin-checkbox-group">
              {genresList.map((g) => (
                <label key={g._id} className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.genres.includes(g._id)}
                    onChange={() => toggleId("genres", g._id)}
                  />
                  {g.name}
                </label>
              ))}
            </div>
          </div>
        )}

        {platformsList.length > 0 && (
          <div className="admin-form-input-wide">
            <p className="admin-form-label">Platforms</p>
            <div className="admin-checkbox-group">
              {platformsList.map((p) => (
                <label key={p._id} className="admin-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.platforms.includes(p._id)}
                    onChange={() => toggleId("platforms", p._id)}
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>
        )}
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
