import express from 'express';
import createService from 'lib/api/createService';

const router = express.Router();

// USER routes

// POST request for creating a new user
router.post('/users', createService);

// GET request for getting users (by query or not)
router.get('/users', createService);

// GET request for getting user by ID
router.get('/users/:userId', createService);

// // PUT request for updating user information
// router.put('/users/:id', controller);

// DELETE request for deleting user by ID
router.delete('/users/:userId', createService);



// DIALOG routes

// POST request for creating a dialog
router.post('/dialogs', createService);

// GET request for getting a dialog by ID
router.get('/dialogs/:dialogId', createService);

// GET request for getting dialogs (by query or not)
router.get('/dialogs', createService);

// DELETE request for deleting a dialog by ID
router.delete('/dialogs/:dialogId', createService);

// POST request for creating a message in dialog
router.post('/dialogs/:dialogId/messages', createService);

// GET request for getting a messages from dialog
router.get('/dialogs/:dialogId/messages', createService);



// // GET request for getting a message from dialog by ID
// router.get('/dialogs/:dialogId/messages/:messageId', createService);
//
// // DELETE request for deleting a message from dialog by ID
// router.get('/dialogs/:dialogId/messages/:messageId', createService);



export default router;
