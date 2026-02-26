'use strict';

const express = require('express');

const router = express.Router();

// In-memory data store for demonstration purposes
let users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' },
];
let nextId = 4;

function parseUserId(paramId) {
  const id = parseInt(paramId, 10);
  if (Number.isNaN(id) || id < 1) {
    return null;
  }
  return id;
}

/**
 * GET /users
 * Returns users with optional pagination, role filter, and search
 * Query: page (default 1), limit (default 20), role (admin|user), search (name or email)
 */
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const roleFilter = req.query.role;
  const search = (req.query.search || '').trim().toLowerCase();

  let result = [...users];

  if (roleFilter) {
    result = result.filter((u) => u.role === roleFilter);
  }
  if (search) {
    result = result.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search)
    );
  }

  const total = result.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * limit;
  const paginatedUsers = result.slice(offset, offset + limit);

  res.json({
    users: paginatedUsers,
    total,
    page: currentPage,
    limit,
    totalPages,
  });
});

/**
 * GET /users/:id
 * Returns a single user by ID
 */
router.get('/:id', (req, res) => {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  res.json(user);
});

/**
 * POST /users
 * Creates a new user
 */
router.post('/', (req, res) => {
  const { name, email, role = 'user' } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'A user with this email already exists' });
  }

  const newUser = { id: nextId++, name, email, role };
  users.push(newUser);

  res.status(201).json(newUser);
});

/**
 * PUT /users/:id
 * Updates an existing user
 */
router.put('/:id', (req, res) => {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  const { name, email, role } = req.body;
  if (email) {
    const existingUser = users.find((u) => u.email === email && u.id !== id);
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
  }
  users[index] = { ...users[index], ...(name && { name }), ...(email && { email }), ...(role && { role }) };

  res.json(users[index]);
});

/**
 * DELETE /users/:id
 * Deletes a user by ID
 */
router.delete('/:id', (req, res) => {
  const id = parseUserId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `User with id ${id} not found` });
  }

  const deleted = users.splice(index, 1)[0];
  res.json({ message: `User ${deleted.name} deleted successfully`, user: deleted });
});

// Export reset function for testing
router._resetUsers = () => {
  users = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'user' },
  ];
  nextId = 4;
};

module.exports = router;
