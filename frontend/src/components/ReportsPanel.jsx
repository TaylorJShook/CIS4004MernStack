import React from "react";

export default function ReportsPanel({ users, games, ratings }) {
  const getUsernameById = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.username : "Unknown User";
  };

  return (
    <section className="reports-panel">
      <h2 className="reports-title">Game Reports</h2>

      <div className="reports-summary-grid">
        <div className="report-card report-card-users">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>
        <div className="report-card report-card-games">
          <h3>Total Games</h3>
          <p>{games.length}</p>
        </div>
        <div className="report-card report-card-ratings">
          <h3>Total Ratings</h3>
          <p>{ratings.length}</p>
        </div>
      </div>

      <div className="reports-game-list">
        {games.length === 0 ? (
          <p className="reports-empty">No games available yet.</p>
        ) : (
          games.map((game) => {
            const gameRatings = ratings.filter((rating) => rating.gameId === game.id);
            const likes = gameRatings.filter((rating) => rating.value === "like");
            const dislikes = gameRatings.filter((rating) => rating.value === "dislike");

            return (
              <div key={game.id} className="reports-game-card">
                <h3 className="reports-game-title">{game.title}</h3>

                <p><strong>Likes:</strong> {likes.length}</p>
                <p>
                  <strong>Liked by:</strong>{" "}
                  {likes.length > 0
                    ? likes.map((rating) => getUsernameById(rating.userId)).join(", ")
                    : "None"}
                </p>

                <p><strong>Dislikes:</strong> {dislikes.length}</p>
                <p>
                  <strong>Disliked by:</strong>{" "}
                  {dislikes.length > 0
                    ? dislikes.map((rating) => getUsernameById(rating.userId)).join(", ")
                    : "None"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
