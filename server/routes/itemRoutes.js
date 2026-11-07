import express from 'express';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getItemMatches,
  getMyActivity
} from '../controllers/itemController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

// Personal activity route (must precede /:id)
router.get('/my/activity', protect, getMyActivity);

// Match discovery route
router.get('/:id/matches', getItemMatches);

// Base routes
router.route('/')
  .get(getItems)
  .post(optionalProtect, createItem);

router.route('/:id')
  .get(getItemById)
  .put(optionalProtect, updateItem)
  .delete(optionalProtect, deleteItem);

export default router;
