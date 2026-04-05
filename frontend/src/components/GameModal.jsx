import React from "react";
import { X, ThumbsDown, ThumbsUp, Star } from "lucide-react";
import StatPill from "./shared/StatPill";

export default function GameModal({ game, onClose, onRate, existingRating, canRate }) {
  if (!game) return null;

  //genres and platforms are now arrays of objects from db, so we join their name: 
  const genres = game.genres?.map((g) => g.name).join(", ") || "—";
  const plats = game.platforms?.map((p) => p.name).join(", ") || "—";

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <button onClick={onClose} className="modal-close-button">
          <X size={20} />
        </button>

        <img src={game.coverImageUrl} alt={game.title} className="modal-image" />

        <div className="modal-content">
          <div className="modal-genre-tag">{genres}</div>
          <h2 className="modal-title">{game.title}</h2>
          <p className="modal-platform">Platform: {plats}</p>
          <p className="modal-description">{game.description}</p>

          <div className="modal-stats-row">
            <StatPill icon={<ThumbsUp size={16} />} label="Likes" value={game.positiveRatings ?? 0} />
            <StatPill icon={<ThumbsDown size={16} />} label="Dislikes" value={(game.totalRatings ?? 0) - (game.positiveRatings ?? 0)} />
            <StatPill icon={<Star size={16} />} label="Your Rating" value={existingRating || "none"} />
          </div>

          {canRate && (
            <div className="modal-rating-actions">
              <button
                onClick={() => onRate(game.gameNumber, "up")}
                className={`modal-like-button${existingRating === "up" ? " active" : ""}`}
              >
                <ThumbsUp size={18} /> Thumbs Up
              </button>
              <button
                onClick={() => onRate(game.gameNumber, "down")}
                className={`modal-dislike-button${existingRating === "down" ? " active" : ""}`}
              >
                <ThumbsDown size={18} /> Thumbs Down
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
