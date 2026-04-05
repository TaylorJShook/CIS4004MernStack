//this file hanlees communication between frontend and backend. API 
//fetch calls are here so rest of app is organized/clean 

const BASE = "http://localhost:5000/api";

//helper function to save,remove, and get JWT token from localStorage 
export const setToken = (token) => localStorage.setItem("token", token);
export const clearToken = () => localStorage.removeItem("token");
export const getToken = () => localStorage.getItem("token");

//these build headers we attached to each request
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });
const jsonHeaders = () => ({ "Content-Type": "application/json" });
const authJsonHeaders = () => ({ ...jsonHeaders(), ...authHeader() });

//parses the response and throws an error if request failed
const handle = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

//auth routes - login, register, get users, delete user
export const auth = {
  //send username and password to backend, gets back JWT token 
  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ username, password }),
    }).then(handle),

  //creates a new user account, gets back a JWT token
  register: (username, password) =>
    fetch(`${BASE}/auth/create`, {
      method: "POST",
      headers: jsonHeaders(),
      body: JSON.stringify({ username, password }),
    }).then(handle),

  //gets currently logged-in user using their token 
  getMe: () =>
    fetch(`${BASE}/auth/me`, { headers: authHeader() }).then(handle),

  //gets all users (for admin only)
  getUsers: () =>
    fetch(`${BASE}/auth/users`, { headers: authHeader() }).then(handle),

  //delete a user by their ID - admin only
  deleteUser: (userId) =>
    fetch(`${BASE}/auth/users/${userId}`, {
      method: "DELETE",
      headers: authHeader(),
    }).then(handle),
};

//fetches all games from database
export const games = {
  getAll: () => fetch(`${BASE}/games`).then(handle),

  //creates new game (Admin only)
  create: (data) =>
    fetch(`${BASE}/games`, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify(data),
    }).then(handle),

  //updates an existing game by its gameNumber -adminonly
  update: (gameNumber, data) =>
    fetch(`${BASE}/games/${gameNumber}`, {
      method: "PUT",
      headers: authJsonHeaders(),
      body: JSON.stringify(data),
    }).then(handle),

  //deletes a game by its gameNumber - admin only
  delete: (gameNumber) =>
    fetch(`${BASE}/games/${gameNumber}`, {
      method: "DELETE",
      headers: authHeader(),
    }).then(handle),
};

//rating routes - get my ratings, rate a game, remove a rating 
export const ratings = {
  getMy: () =>
    fetch(`${BASE}/ratings/my`, { headers: authHeader() }).then(handle),

  //submits an "up" or "down" vote for a game
  rate: (gameNumber, vote) =>
    fetch(`${BASE}/ratings`, {
      method: "POST",
      headers: authJsonHeaders(),
      body: JSON.stringify({ gameNumber, vote }),
    }).then(handle),
  
  //removes current users rating for a game
  remove: (gameNumber) =>
    fetch(`${BASE}/ratings/${gameNumber}`, {
      method: "DELETE",
      headers: authHeader(),
    }).then(handle),
};

//genre and platform routs - used to populat checkboxes in the game form 
export const genres = {
  getAll: () => fetch(`${BASE}/genres`).then(handle),
};

export const platforms = {
  getAll: () => fetch(`${BASE}/platforms`).then(handle),
};
