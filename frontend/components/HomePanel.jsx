import React from "react";
import { Gamepad2, ThumbsUp, User } from "lucide-react";
import StatPill from "./shared/StatPill";
import GameGrid from "./GameGrid";

export default function HomePanel({ games, currentUser, onOpen, onEdit, onDelete, totalRatings }) {
  return (
    <section>
      <div className="home-stats-row">
        <StatPill icon={<Gamepad2 size={16} />} label="Games" value={games.length} />
        <StatPill icon={<ThumbsUp size={16} />} label="My Ratings" value={totalRatings} />
      </div>

      <GameGrid
        games={games}
        onOpen={onOpen}
        canManage={currentUser.role === "admin"}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
}
