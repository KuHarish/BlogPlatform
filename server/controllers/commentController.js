const asyncHandler = require('express-async-handler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 });

  res.json(comments);
});

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { postId, comment } = req.body;

  const post = await Post.findById(postId);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const newComment = new Comment({
    postId,
    userId: req.user._id,
    comment,
  });

  const createdComment = await newComment.save();
  await createdComment.populate('userId', 'name avatar');
  
  res.status(201).json(createdComment);
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    // Check if the user is the author of the comment
    if (comment.userId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
});

// @desc    Get comment count by user (for stats)
// @route   GET /api/comments/user/:id/count
// @access  Public
const getUserCommentCount = asyncHandler(async (req, res) => {
  const count = await Comment.countDocuments({ userId: req.params.id });
  res.json({ count });
});

module.exports = {
  getComments,
  addComment,
  deleteComment,
  getUserCommentCount,
};
