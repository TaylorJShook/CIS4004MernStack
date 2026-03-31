import React from "react";

export default function GameCard({ game, onOpen, canManage, onEdit, onDelete }) {
  return (
    <article className="game-card-panel">
      <img src={game.cover} alt={game.title} className="game-card-image" />
      <div className="game-card-body">
        <div className="game-card-header">
          <h3 className="game-card-title">{game.title}</h3>
          <span className="game-card-genre">{game.genre}</span>
        </div>

        <p className="game-card-platform">Platform: {game.platform}</p>
        <p className="game-card-likes">👍 {game.likes} people liked this</p>

        <button onClick={() => onOpen(game)} className="game-card-details-button">
          View Details
        </button>

        {canManage && (
          <div className="game-card-admin-actions">
            <button onClick={() => onEdit(game)} className="game-card-edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(game.id)} className="game-card-delete-button">
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}