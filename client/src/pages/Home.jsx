import { useState, useEffect } from 'react';
import api from '../services/api';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/posts?pageNumber=${page}`);
        setPosts(data.posts);
        setPages(data.pages);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div>
      <div className="bg-primary/10 dark:bg-slate-800 rounded-2xl p-8 mb-12 text-center border border-primary/20 dark:border-slate-700">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-accent mb-4">
          Welcome to DevBlog
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A place to share your knowledge, read engaging articles, and connect with other developers around the world.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 border-b pb-2 dark:border-slate-700">Latest Blogs</h2>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="animate-pulse bg-white dark:bg-slate-800 rounded-lg h-[400px] border dark:border-slate-700">
                <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-t-lg"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                  <div className="h-20 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-xl">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && pages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Previous
          </button>
          {[...Array(pages).keys()].map(x => (
            <button
              key={x + 1}
              onClick={() => setPage(x + 1)}
              className={`px-4 py-2 border rounded-md dark:border-slate-700 ${page === x + 1 ? 'bg-primary text-white' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {x + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
