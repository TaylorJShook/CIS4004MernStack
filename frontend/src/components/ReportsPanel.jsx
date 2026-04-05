import React from "react";

//no longer receives ratings as a seperate prop, game states come directly from each game obejct
export default function ReportsPanel({ users, games }) {
  const totalRatings = games.reduce((sum, g) => sum + (g.totalRatings ?? 0), 0);

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
          <p>{totalRatings}</p>
        </div>
      </div>

      <div className="reports-game-list">
        {games.length === 0 ? (
          <p className="reports-empty">No games available yet.</p>
        ) : (
          games.map((game) => {
            const dislikes = (game.totalRatings ?? 0) - (game.positiveRatings ?? 0);
            const genres = game.genres?.map((g) => g.name).join(", ") || "—";
            const plats = game.platforms?.map((p) => p.name).join(", ") || "—";

            return (
              <div key={game._id} className="reports-game-card">
                <h3 className="reports-game-title">{game.title}</h3>
                <p><strong>Genres:</strong> {genres}</p>
                <p><strong>Platforms:</strong> {plats}</p>
                <p><strong>Likes:</strong> {game.positiveRatings ?? 0}</p>
                <p><strong>Dislikes:</strong> {dislikes}</p>
                <p><strong>Approval:</strong> {game.positivePercentage ?? 0}%</p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
