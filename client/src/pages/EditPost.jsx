import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import { toast } from 'react-toastify';
import api from '../services/api';
import AuthContext from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        if (user && data.author._id !== user._id) {
          toast.error('You are not authorized to edit this post');
          navigate('/');
          return;
        }
        setTitle(data.title);
        setContent(data.content);
        setCurrentImage(data.image);
      } catch (error) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setFetching(false);
      }
    };

    fetchPost();
  }, [id, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Please provide a title and content');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await api.put(`/posts/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border dark:border-slate-700">
      <h2 className="text-3xl font-bold mb-6 text-primary dark:text-accent">Edit Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Update Featured Image</label>
          {currentImage && (
            <div className="mb-2">
              <img src={currentImage} alt="Current" className="h-32 rounded-md object-cover" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <div className="bg-white text-black rounded-md overflow-hidden border dark:border-slate-600">
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              className="h-64 mb-12"
            />
          </div>
        </div>

        <div className="pt-4 flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/post/${id}`)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
