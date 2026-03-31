import React, { useMemo, useState } from "react";
import AuthPage from "./components/AuthPage";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import HomePanel from "./components/HomePanel";
import GameForm from "./components/GameForm";
import GameGrid from "./components/GameGrid";
import GameModal from "./components/GameModal";
import AdminUsersTable from "./components/AdminUsersTable";
import ReportsPanel from "./components/ReportsPanel";
import MyRatingsPanel from "./components/MyRatingsPanel";
import ProfilePanel from "./components/ProfilePanel";
import "./css/app.css";

const starterUsers = [
  { id: 1, username: "admin1", password: "password1", role: "admin" },
  { id: 2, username: "player1", password: "player123", role: "standard" },
];

export default function App() {
  const [users, setUsers] = useState(starterUsers);
  const [games, setGames] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [view, setView] = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    platform: "",
    cover: "",
    description: "",
  });

  const enrichedGames = useMemo(() => {
    return games.map((game) => {
      const gameRatings = ratings.filter((rating) => rating.gameId === game.id);
      return {
        ...game,
        likes: gameRatings.filter((rating) => rating.value === "like").length,
        dislikes: gameRatings.filter((rating) => rating.value === "dislike").length,
      };
    });
  }, [games, ratings]);

  const currentUserRatings = currentUser
    ? ratings.filter((rating) => rating.userId === currentUser.id)
    : [];

  const selectedGameRating =
    currentUser && selectedGame
      ? ratings.find(
          (rating) =>
            rating.userId === currentUser.id && rating.gameId === selectedGame.id
        )?.value
      : null;

  const resetGameForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      genre: "",
      platform: "",
      cover: "",
      description: "",
    });
  };

  const handleLogin = (username, password) => {
    const found = users.find(
      (user) => user.username === username && user.password === password
    );

    if (!found) {
      setError("Invalid username or password.");
      return;
    }

    setCurrentUser(found);
    setView("home");
    setError("");
  };

  const handleCreateUser = (username, password) => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    const duplicate = users.some(
      (user) => user.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (duplicate) {
      setError("That username is already taken.");
      return;
    }

    const newUser = {
      id: Date.now(),
      username: username.trim(),
      password: password.trim(),
      role: "standard",
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setView("home");
    setError("");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedGame(null);
    setView("home");
    resetGameForm();
  };

  const handleRate = (gameId, value) => {
    if (!currentUser || currentUser.role !== "standard") return;

    setRatings((prev) => {
      const existing = prev.find(
        (rating) => rating.userId === currentUser.id && rating.gameId === gameId
      );

      if (existing) {
        return prev.map((rating) =>
          rating.id === existing.id ? { ...rating, value } : rating
        );
      }

      return [...prev, { id: Date.now(), userId: currentUser.id, gameId, value }];
    });
  };

  const handleDeleteOwnRating = (ratingId) => {
    setRatings((prev) =>
      prev.filter(
        (rating) => !(rating.id === ratingId && rating.userId === currentUser.id)
      )
    );
  };

  const handleCreateOrUpdateGame = () => {
    if (
      !formData.title ||
      !formData.genre ||
      !formData.platform ||
      !formData.cover ||
      !formData.description
    ) {
      return;
    }

    if (editingId) {
      setGames((prev) =>
        prev.map((game) => (game.id === editingId ? { ...game, ...formData } : game))
      );
    } else {
      setGames((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
          createdBy: currentUser?.username || "admin1",
        },
      ]);
    }

    resetGameForm();
  };

  const handleEditGame = (game) => {
    setView("manage-games");
    setEditingId(game.id);
    setFormData({
      title: game.title,
      genre: game.genre,
      platform: game.platform || "",
      cover: game.cover,
      description: game.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteGame = (gameId) => {
    setGames((prev) => prev.filter((game) => game.id !== gameId));
    setRatings((prev) => prev.filter((rating) => rating.gameId !== gameId));
    if (selectedGame?.id === gameId) {
      setSelectedGame(null);
    }
  };

  const handleDeleteUser = (userId) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    setRatings((prev) => prev.filter((rating) => rating.userId !== userId));
  };

  if (!currentUser) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onCreateUser={handleCreateUser}
        error={error}
      />
    );
  }

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <Sidebar
          currentUser={currentUser}
          view={view}
          setView={setView}
          onLogout={handleLogout}
        />

        <main className="dashboard-main">
          <TopBar currentUser={currentUser} />

          {view === "home" && (
            <HomePanel
              games={enrichedGames}
              currentUser={currentUser}
              onOpen={setSelectedGame}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
              totalRatings={currentUserRatings.length}
            />
          )}

          {currentUser.role === "admin" && view === "manage-games" && (
            <div className="admin-page-stack">
              <GameForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateOrUpdateGame}
                editingId={editingId}
                onCancel={resetGameForm}
              />

              <GameGrid
                games={enrichedGames}
                onOpen={setSelectedGame}
                canManage
                onEdit={handleEditGame}
                onDelete={handleDeleteGame}
              />
            </div>
          )}

          {currentUser.role === "admin" && view === "manage-users" && (
            <AdminUsersTable
              users={users}
              currentUser={currentUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {currentUser.role === "admin" && view === "reports" && (
            <ReportsPanel users={users} games={enrichedGames} ratings={ratings} />
          )}

          {currentUser.role === "standard" && view === "my-ratings" && (
            <MyRatingsPanel
              ratings={ratings}
              games={enrichedGames}
              currentUser={currentUser}
              onDeleteOwnRating={handleDeleteOwnRating}
            />
          )}

          {currentUser.role === "standard" && view === "profile" && (
            <ProfilePanel
              currentUser={currentUser}
              totalRatings={currentUserRatings.length}
            />
          )}
        </main>
      </div>

      <GameModal
        game={
          selectedGame
            ? enrichedGames.find((game) => game.id === selectedGame.id) || selectedGame
            : null
        }
        onClose={() => setSelectedGame(null)}
        onRate={handleRate}
        existingRating={selectedGameRating}
        canRate={currentUser.role === "standard"}
      />
    </div>
  );
}