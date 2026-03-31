import React from "react";
import { Gamepad2 } from "lucide-react";

export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state-panel">
      <div className="empty-state-icon">
        <Gamepad2 size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
    </div>
  );
}