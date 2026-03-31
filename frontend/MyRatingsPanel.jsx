import React from "react";
import { Trash2 } from "lucide-react";
import EmptyState from "./shared/EmptyState";

export default function MyRatingsPanel({ ratings, games, currentUser, onDeleteOwnRating }) {
  const myRatings = ratings.filter((rating) => rating.userId === currentUser.id);

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
          myRatings.map((rating) => {
            const game = games.find((g) => g.id === rating.gameId);
            return (
              <div key={rating.id} className="ratings-list-item">
                <div>
                  <div className="ratings-item-title">{game?.title || "Unknown Game"}</div>
                  <div className="ratings-item-value">Your rating: {rating.value}</div>
                </div>
                <button onClick={() => onDeleteOwnRating(rating.id)} className="ratings-delete-button">
                  <Trash2 size={16} /> Delete My Rating
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}