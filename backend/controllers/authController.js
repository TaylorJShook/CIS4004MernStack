const User = require('../models/user')
const bcrypt = require('bcryptjs')

/*
 * POST /api/auth/create
 * Creates a new user.
 *
 * Request body (JSON):
 *   username  {string}  required  Must be unique
 *   password  {string}  required  Will be hashed with bcrypt
 *   role      {string}  optional  "admin" or "user" — defaults to "user"
 *
 * Responses:
 *   201 - User created successfully
 *   409 - Username already exists
 */
const createUser = async (req, res) => {

    if (req.body === undefined) { return res.status(404).json({ message: "Did not send body" }) }

    const { username, password, role } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const lastUser = await User.findOne().sort({ userNumber: -1 })
    const userNumber = lastUser ? lastUser.userNumber + 1 : 1

    const user = new User({ userNumber, username, password: hashedPassword, role })
    await user.save()

    res.status(201).json({ message: "User created successfully" })
}

/*
 * POST /api/auth/login
 * Logs in an existing user.
 *
 * Request body (JSON):
 *   username  {string}  required
 *   password  {string}  required
 *
 * Responses:
 *   200 - Login successful
 *   401 - Invalid credentials (wrong username or password)
 */
const login = async (req, res) => {

    if (req.body === undefined) { return res.status(404).json({ message: "Did not send body" }) }

    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    // TODO: handle session creation stuff here ?
    res.status(200).json({ message: "Login successful" })
}

/*
 * GET /api/auth/users
 * Returns all users in the database.
 *
 * Request body: none
 *
 * Responses:
 *   200 - Array of user objects (userNumber, username, role, createdAt, updatedAt)
 */
const getUsers = async (req, res) => {
    const users = await User.find()
    res.status(200).json(users)
}

module.exports = { createUser, getUsers, login };