import React from "react";
import GameCard from "./GameCard";
import EmptyState from "./shared/EmptyState";

export default function GameGrid({ games, onOpen, canManage, onEdit, onDelete }) {
  if (games.length === 0) {
    return (
      <EmptyState
        title="No games yet"
        message={canManage ? "Create your first game by going to the Manage Games tab." : "Admins have not added any games yet."}
      />
    );
  }

  return (
    <div className="game-grid-layout">
  {games.map((game) => (
    <GameCard
      key={game.id}
      game={game}
      onOpen={onOpen}
      canManage={canManage}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ))}
</div>
  );
}
