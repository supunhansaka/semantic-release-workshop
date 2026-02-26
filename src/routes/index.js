'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET /
 * Home route - returns API info and available endpoints
 */
router.get('/', (req, res) => {
  res.json({
    name: 'semantic-release-workshop-test',
    version: process.env.npm_package_version || '1.0.0',
    description: 'A Node.js + Express app showcasing semantic-release, conventional commits, and husky',
    endpoints: {
      'GET /': 'API information',
      'GET /health': 'Health check',
      'GET /users': 'List users (query: page, limit, role, search)',
      'GET /users/:id': 'Get user by ID',
      'POST /users': 'Create a new user',
      'PUT /users/:id': 'Update a user',
      'DELETE /users/:id': 'Delete a user',
    },
  });
});

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/test', (req, res) => {
  res.json({ status: 'test', timestamp: new Date().toISOString() });
});

module.exports = router;
