import express from 'express';

import {
  createUser,
  getUsers
} from 'lib/api/services/';

const router = express.Router();

// USER routes

// POST request for creating a new user
router.post('/users', createUser);

// GET request for getting users (by query or not)
router.get('/users', getUsers);
//
// // GET request for getting user by ID
// router.get('/users/:id', controller);
//
// // PUT request for updating user information
// router.put('/users/:id', controller);
//
// // DELETE request for deleting user
// router.delete('/users/:id', controller);
//
//
//
// // MESSAGE routes
//
// // POST request for creating message
// router.post('/messages', controller);
//
// // GET request for getting all messages
// router.get('/messages', controller);

export default router;
