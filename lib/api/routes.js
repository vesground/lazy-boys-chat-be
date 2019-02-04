import express from 'express';

import {
  createUser,
  getUserById,
  getUsers,
  deleteUser,
  createDialog,
  getDialogById,
  getDialogs,
  deleteDialog,
} from 'lib/api/services/';

const router = express.Router();

// USER routes

// POST request for creating a new user
router.post('/users', createUser);

// GET request for getting users (by query or not)
router.get('/users', getUsers);

// GET request for getting user by ID
router.get('/users/:id', getUserById);

// // PUT request for updating user information
// router.put('/users/:id', controller);

// DELETE request for deleting user
router.delete('/users/:id', deleteUser);



// DIALOG routes

// POST request for creating a dialog
router.post('/dialogs', createDialog);

// GET request for getting a dialog by ID
router.get('/dialogs/:id', getDialogById);

// GET request for getting dialogs (by query or not)
router.get('/dialogs', getDialogs);

// DELETE request for deleting dialog
router.delete('/dialogs/:id', deleteDialog);

export default router;
