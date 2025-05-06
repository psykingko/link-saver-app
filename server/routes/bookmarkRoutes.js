import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createBookmark,
  getBookmarks,
  deleteBookmark
} from '../controllers/bookmarkController.js';

const router = express.Router();

// Create a bookmark
router.post('/', verifyToken, createBookmark);

// Get all bookmarks for a user
router.get('/', verifyToken, getBookmarks);

// Delete a bookmark
router.delete('/:id', verifyToken, deleteBookmark);

export default router;
