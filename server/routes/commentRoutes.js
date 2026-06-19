const express = require('express');
const router = express.Router();
const {
  getComments,
  addComment,
  deleteComment,
  getUserCommentCount,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addComment);

router.route('/:id')
  .delete(protect, deleteComment);

router.get('/:postId', getComments);
router.get('/user/:id/count', getUserCommentCount);

module.exports = router;
