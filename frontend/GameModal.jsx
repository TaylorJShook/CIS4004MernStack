import React from "react";
import { X, ThumbsDown, ThumbsUp, Star } from "lucide-react";
import StatPill from "./shared/StatPill";

export default function GameModal({ game, onClose, onRate, existingRating, canRate }) {
  if (!game) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-panel">
        <button onClick={onClose} className="modal-close-button">
          <X size={20} />
        </button>

        <img src={game.cover} alt={game.title} className="modal-image" />

        <div className="modal-content">
          <div className="modal-genre-tag">{game.genre}</div>
          <h2 className="modal-title">{game.title}</h2>
          <p className="modal-platform">Platform: {game.platform}</p>
          <p className="modal-description">{game.description}</p>

          <div className="modal-stats-row">
            <StatPill icon={<ThumbsUp size={16} />} label="Likes" value={game.likes} />
            <StatPill icon={<ThumbsDown size={16} />} label="Dislikes" value={game.dislikes} />
            <StatPill icon={<Star size={16} />} label="Your Rating" value={existingRating || "none"} />
          </div>

          {canRate && (
            <div className="modal-rating-actions">
              <button onClick={() => onRate(game.id, "like")} className="modal-like-button">
                <ThumbsUp size={18} /> Thumbs Up
              </button>
              <button onClick={() => onRate(game.id, "dislike")} className="modal-dislike-button">
                <ThumbsDown size={18} /> Thumbs Down
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}