import React from "react";

export default function ProfilePanel({ currentUser, totalRatings }) {
  return (
    <section className="profile-panel">
      <h2 className="profile-panel-title">My Profile</h2>

      <div className="profile-details">
        <p><strong>Username:</strong> {currentUser.username}</p>
        <p><strong>Role:</strong> Standard User</p>
        <p><strong>Ratings Submitted:</strong> {totalRatings}</p>
      </div>
    </section>
  );
}