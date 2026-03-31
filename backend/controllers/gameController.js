const Game = require("../models/game");

/*
 * GET /api/games
 * Returns all games in the database.
 *
 * Request body: none
 *
 * Responses:
 *   200 - Array of game objects
 */
const getGames = async (req, res) => {
    const games = await Game.find();
    res.json(games);
};

/*
 * GET /api/games/:gameId
 * Returns a single game by its gameNumber.
 *
 * URL params:
 *   gameId  {number}  required  The gameNumber of the game to retrieve
 *
 * Request body: none
 *
 * Responses:
 *   200 - Game object
 *   404 - Game not found
 */
const getGame = async (req, res) => {
    const game = await Game.findOne({ gameNumber: req.params.gameId })
    if (!game) { res.status(404).json({ message: `Game with GameNumber ${req.params.gameId} Not Found` }) }
    res.status(200).json(game)
};

/*
 * POST /api/games
 * Creates a new game. gameNumber is auto-assigned.
 *
 * Request body (JSON):
 *   title          {string}    required  Must be unique
 *   description    {string}    required
 *   coverImageUrl  {string}    required
 *   createdBy      {ObjectId}  required  Reference to a User _id
 *   genres         {ObjectId[]} required  Array of Genre _id references
 *   platforms      {ObjectId[]} required  Array of Platform _id references
 *
 * Responses:
 *   201 - Created game object
 */
const createGame = async (req, res) => {
    const lastGame = await Game.findOne().sort({ gameNumber: -1 });
    const nextGameNumber = lastGame ? lastGame.gameNumber + 1 : 1;

    const game = new Game({ gameNumber: nextGameNumber, ...req.body });
    const savedGame = await game.save();
    res.status(201).json(savedGame);
};

/*
 * PUT /api/games/:gameId
 * Updates an existing game by its gameNumber.
 *
 * URL params:
 *   gameId  {number}  required  The gameNumber of the game to update
 *
 * Request body (JSON) — include only fields to update:
 *   title          {string}
 *   description    {string}
 *   coverImageUrl  {string}
 *   createdBy      {ObjectId}
 *   genres         {ObjectId[]}
 *   platforms      {ObjectId[]}
 *
 * Responses:
 *   200 - Updated game object
 *   404 - Game not found
 */
const updateGame = async (req, res) => {
    const updatedGame = await Game.findOneAndUpdate(
        { gameNumber: req.params.gameId },
        req.body,
        { new: true, runValidators: true }
    );
    if (!updatedGame) return res.status(404).json({ message: "Game not found" });
    res.json(updatedGame);
};

/*
 * DELETE /api/games/:gameId
 * Deletes a game by its gameNumber.
 *
 * URL params:
 *   gameId  {number}  required  The gameNumber of the game to delete
 *
 * Request body: none
 *
 * Responses:
 *   200 - Deleted game object with confirmation message
 *   404 - Game not found
 */
const deleteGame = async (req, res) => {
    const deletedGame = await Game.findOneAndDelete({ gameNumber: req.params.gameId });
    if (!deletedGame) return res.status(404).json({ message: "Game not found" });
    res.json({ message: "Game deleted", game: deletedGame });
};

module.exports = { getGames, getGame, createGame, updateGame, deleteGame };
