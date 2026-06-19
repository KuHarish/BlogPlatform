import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Trash2, Edit } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id, navigate]);

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        toast.success('Post deleted');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const { data } = await api.post('/comments', {
        postId: id,
        comment: newComment
      });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(c => c._id !== commentId));
        toast.success('Comment deleted');
      } catch (error) {
        toast.error('Failed to delete comment');
      }
    }
  };

  if (loading) return <div className="text-center py-20 text-xl">Loading...</div>;
  if (!post) return null;

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border dark:border-slate-700">
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-lg mb-8" />
      )}
      
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{post.title}</h1>
        {isAuthor && (
          <div className="flex space-x-2">
            <Link to={`/edit/${post._id}`} className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
              <Edit className="w-5 h-5" />
            </Link>
            <button onClick={handleDeletePost} className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center text-slate-500 mb-8 pb-8 border-b dark:border-slate-700">
        <div className="font-medium text-primary">By {post.author.name}</div>
        <span className="mx-3">•</span>
        <div>{format(new Date(post.createdAt), 'MMMM d, yyyy h:mm a')}</div>
      </div>

      <div 
        className="prose dark:prose-invert max-w-none mb-12 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <div className="border-t dark:border-slate-700 pt-8 mt-12">
        <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
        
        {user ? (
          <form onSubmit={handleAddComment} className="mb-8">
            <textarea
              className="w-full p-3 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              type="submit"
              disabled={commentLoading || !newComment.trim()}
              className="mt-2 bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-md mb-8 text-center">
            <p>Please <Link to="/login" className="text-primary hover:underline">login</Link> to leave a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-slate-500">No comments yet. Be the first to comment!</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border dark:border-slate-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-primary">{comment.userId?.name || 'User'}</div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-500">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                    {user && comment.userId && comment.userId._id === user._id && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
