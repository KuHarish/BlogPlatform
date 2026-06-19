import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { User, FileText, MessageSquare } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const [postsRes, commentsRes] = await Promise.all([
          api.get(`/posts/user/${user._id}`),
          api.get(`/comments/user/${user._id}/count`)
        ]);
        setUserPosts(postsRes.data);
        setCommentCount(commentsRes.data.count);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (!user) return <div className="text-center py-10">Please login to view profile.</div>;
  if (loading) return <div className="text-center py-10">Loading profile data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Dashboard Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border dark:border-slate-700 p-8 mb-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 border-b dark:border-slate-700 pb-8">
          <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center text-4xl overflow-hidden shrink-0">
            {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" /> : <User size={48} />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
            <p className="text-slate-500 mt-1">{user.email}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Dashboard Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg border dark:border-slate-600 flex items-center">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-full mr-4 dark:bg-blue-900/30 dark:text-blue-400">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Total Posts</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{userPosts.length}</div>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-lg border dark:border-slate-600 flex items-center">
            <div className="p-4 bg-green-100 text-green-600 rounded-full mr-4 dark:bg-green-900/30 dark:text-green-400">
              <MessageSquare size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-500 font-medium">Total Comments</div>
              <div className="text-3xl font-bold text-slate-900 dark:text-white">{commentCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Blogs */}
      <div>
        <div className="flex justify-between items-center mb-6 border-b dark:border-slate-700 pb-2">
          <h2 className="text-2xl font-bold">Your Blogs</h2>
          <Link to="/create" className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Create New
          </Link>
        </div>
        
        {userPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg p-10 text-center border dark:border-slate-700 text-slate-500">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl mb-4">You haven't written any blogs yet.</p>
            <Link to="/create" className="text-primary hover:underline">Start writing your first post!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userPosts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
