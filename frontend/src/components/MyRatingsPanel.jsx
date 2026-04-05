import React from "react";
import { Trash2 } from "lucide-react";
import EmptyState from "./shared/EmptyState";

//now receives myRatings directly (already filtered by the backend) instead of all ratings
export default function MyRatingsPanel({ myRatings, onDeleteOwnRating }) {
  return (
    <section className="ratings-panel">
      <h2 className="ratings-panel-title">My Ratings</h2>

      <div className="ratings-list">
        {myRatings.length === 0 ? (
          <EmptyState
            title="No ratings yet"
            message="Open a game from the home page and leave a thumbs up or thumbs down."
          />
        ) : (
          myRatings.map((rating) => (
            <div key={rating._id} className="ratings-list-item">
              <div>
                <div className="ratings-item-title">{rating.game?.title || "Unknown Game"}</div>
                <div className="ratings-item-value">Your rating: {rating.vote}</div>
              </div>
              <button
                onClick={() => onDeleteOwnRating(rating.game?.gameNumber)}
                className="ratings-delete-button"
              >
                <Trash2 size={16} /> Delete My Rating
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
