import React, { useEffect, useState } from "react";
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
import { auth, games, ratings, genres, platforms, setToken, clearToken, getToken } from "./services/api";
import "./css/app.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [gamesList, setGamesList] = useState([]);
  const [myRatings, setMyRatings] = useState([]);     //stores the logged-in users rating from DB
  const [users, setUsers] = useState([]);
  const [genresList, setGenresList] = useState([]);         //genres loaded from DB for the game form
  const [platformsList, setPlatformsList] = useState([]);   //platforms loaded from db to game form 
  const [error, setError] = useState("");
  const [view, setView] = useState("home");
  const [selectedGame, setSelectedGame] = useState(null);
  const [editingGame, setEditingGame] = useState(null);     //now stores the full game object instance of just an id 
  const [formData, setFormData] = useState({
    title: "",
    genres: [],         //array of genre IDs to send to bakcend
    platforms: [],      //array of platform IDs to send to backend 
    coverImageUrl: "",  //renaemd from "cover" to match backend field name 
    description: "",
  });

  // On mount: restore session from localStorage token
  useEffect(() => {
    if (!getToken()) return;
    auth.getMe()
      .then((user) => {
        setCurrentUser(user);
      })
      .catch(() => {
        clearToken();
      });
  }, []);

  // runs whenever currentUser changed - loads all data needed
  useEffect(() => {
    if (!currentUser) return;
    fetchGames();
    fetchGenresAndPlatforms();
    if (currentUser.role !== "admin") {
      fetchMyRatings();
    } else {
      fetchUsers();
    }
  }, [currentUser]);

  //gets all games from backend
  const fetchGames = async () => {
    try {
      const data = await games.getAll();
      setGamesList(data);
    } catch (e) {
      console.error("Failed to load games:", e.message);
    }
  };

  //gets only current users ratings from backend
  const fetchMyRatings = async () => {
    try {
      const data = await ratings.getMy();
      setMyRatings(data);
    } catch (e) {
      console.error("Failed to load ratings:", e.message);
    }
  };

  //gets all registed users - only called for admins
  const fetchUsers = async () => {
    try {
      const data = await auth.getUsers();
      setUsers(data);
    } catch (e) {
      console.error("Failed to load users:", e.message);
    }
  };

  //gets genres and platforms at same time to populate games from checkboxes 
  const fetchGenresAndPlatforms = async () => {
    try {
      const [g, p] = await Promise.all([genres.getAll(), platforms.getAll()]);
      setGenresList(g);
      setPlatformsList(p);
    } catch (e) {
      console.error("Failed to load genres/platforms:", e.message);
    }
  };

  //now calls backend login  endpoint and saves the JWT token 
  const handleLogin = async (username, password) => {
    try {
      const data = await auth.login(username, password);
      setToken(data.token);
      setCurrentUser(data.user);
      setView("home");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  //now calls backend register endpoint and saves JWT token 
  const handleCreateUser = async (username, password) => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    try {
      const data = await auth.register(username, password);
      setToken(data.token);
      setCurrentUser(data.user);
      setView("home");
      setError("");
    } catch (e) {
      setError(e.message);
    }
  };

  //clears JWT token form localstorage on logout
  const handleLogout = () => {
    clearToken();
    setCurrentUser(null);
    setGamesList([]);
    setMyRatings([]);
    setUsers([]);
    setSelectedGame(null);
    setView("home");
    resetGameForm();
  };

  const resetGameForm = () => {
    setEditingGame(null);
    setFormData({ title: "", genres: [], platforms: [], coverImageUrl: "", description: "" });
  };

  //now sends game data to backend instead of udpating local state 
  const handleCreateOrUpdateGame = async () => {
    if (!formData.title || !formData.coverImageUrl || !formData.description) return;
    try {
      if (editingGame) {
        const updated = await games.update(editingGame.gameNumber, formData);
        setGamesList((prev) =>
          prev.map((g) => (g._id === updated._id ? updated : g))
        );
      } else {
        const created = await games.create(formData);
        setGamesList((prev) => [created, ...prev]);
      }
      resetGameForm();
    } catch (e) {
      setError(e.message);
    }
  };

  //stores the full game object so we can access gamenumber for API call 
  const handleEditGame = (game) => {
    setView("manage-games");
    setEditingGame(game);
    setFormData({
      title: game.title,
      genres: game.genres.map((g) => g._id),        //pull just the IDs to pre-check the checkboxes 
      platforms: game.platforms.map((p) => p._id),
      coverImageUrl: game.coverImageUrl,
      description: game.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //now calls backend delete endpoint using games gameNumber
  const handleDeleteGame = async (gameNumber) => {
    try {
      await games.delete(gameNumber);
      setGamesList((prev) => prev.filter((g) => g.gameNumber !== gameNumber));
      if (selectedGame?.gameNumber === gameNumber) setSelectedGame(null);
    } catch (e) {
      setError(e.message);
    }
  };

  //changed - now sends the vote to the backend and updates the games live counts from the server response 
  const handleRate = async (gameNumber, vote) => {
    try {
      const data = await ratings.rate(gameNumber, vote);
      // Update the game in list with fresh counts from server
      setGamesList((prev) =>
        prev.map((g) => (g.gameNumber === data.game.gameNumber ? { ...g, ...data.game } : g))
      );
      // Update selectedGame if open
      if (selectedGame?.gameNumber === gameNumber) {
        setSelectedGame((prev) => ({ ...prev, ...data.game }));
      }
      await fetchMyRatings();
    } catch (e) {
      setError(e.message);
    }
  };

  //now calls the backend to remove the rating and sync 
  const handleDeleteOwnRating = async (gameNumber) => {
    try {
      const data = await ratings.remove(gameNumber);
      setGamesList((prev) =>
        prev.map((g) => (g.gameNumber === data.game.gameNumber ? { ...g, ...data.game } : g))
      );
      if (selectedGame?.gameNumber === gameNumber) {
        setSelectedGame((prev) => ({ ...prev, ...data.game }));
      }
      await fetchMyRatings();
    } catch (e) {
      setError(e.message);
    }
  };

  //now calls the backend delete endpoint using the users MongoDB _id
  const handleDeleteUser = async (userId) => {
    try {
      await auth.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      setError(e.message);
    }
  };

  //find the current user's rating for the open modal game
  const selectedGameRating = selectedGame
    ? myRatings.find((r) => r.game?.gameNumber === selectedGame.gameNumber)?.vote ?? null
    : null;

  // Keep selectedGame in sync with gamesList (so counts update without reopening)
  const selectedGameEnriched = selectedGame
    ? gamesList.find((g) => g.gameNumber === selectedGame.gameNumber) || selectedGame
    : null;

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onCreateUser={handleCreateUser} error={error} />;
  }

  return (
    <div className="app-shell">
      <div className="dashboard-layout">
        <Sidebar currentUser={currentUser} view={view} setView={setView} onLogout={handleLogout} />

        <main className="dashboard-main">
          <TopBar currentUser={currentUser} />

          {view === "home" && (
            <HomePanel
              games={gamesList}
              currentUser={currentUser}
              onOpen={setSelectedGame}
              onEdit={handleEditGame}
              onDelete={handleDeleteGame}
              totalRatings={myRatings.length}
            />
          )}

          {currentUser.role === "admin" && view === "manage-games" && (
            <div className="admin-page-stack">
              <GameForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateOrUpdateGame}
                editingId={editingGame?._id || null}
                onCancel={resetGameForm}
                genresList={genresList}
                platformsList={platformsList}
              />
              <GameGrid
                games={gamesList}
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
            <ReportsPanel users={users} games={gamesList} />
          )}

          {currentUser.role !== "admin" && view === "my-ratings" && (
            <MyRatingsPanel
              myRatings={myRatings}
              onDeleteOwnRating={handleDeleteOwnRating}
            />
          )}

          {currentUser.role !== "admin" && view === "profile" && (
            <ProfilePanel currentUser={currentUser} totalRatings={myRatings.length} />
          )}
        </main>
      </div>

      <GameModal
        game={selectedGameEnriched}
        onClose={() => setSelectedGame(null)}
        onRate={handleRate}
        existingRating={selectedGameRating}
        canRate={currentUser.role !== "admin"}
      />
    </div>
  );
}
