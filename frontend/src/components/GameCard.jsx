import React from "react";

export default function GameCard({ game, onOpen, canManage, onEdit, onDelete }) {
  //genres and platforms are now arrays of objects from DB, so we join their names
  const genres = game.genres?.map((g) => g.name).join(", ") || "—";
  const plats = game.platforms?.map((p) => p.name).join(", ") || "—";

  return (
    <article className="game-card-panel">
      <img src={game.coverImageUrl} alt={game.title} className="game-card-image" />
      <div className="game-card-body">
        <div className="game-card-header">
          <h3 className="game-card-title">{game.title}</h3>
          <span className="game-card-genre">{genres}</span>
        </div>

        <p className="game-card-platform">Platform: {plats}</p>
        <p className="game-card-likes">👍 {game.positiveRatings ?? 0} people liked this</p>
        <p className="game-card-likes">👎 {(game.totalRatings - game.positiveRatings) ?? 0} people disliked this</p>

        <button onClick={() => onOpen(game)} className="game-card-details-button">
          View Details
        </button>

        {canManage && (
          <div className="game-card-admin-actions">
            <button onClick={() => onEdit(game)} className="game-card-edit-button">
              Edit
            </button>
            <button onClick={() => onDelete(game.gameNumber)} className="game-card-delete-button">
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
