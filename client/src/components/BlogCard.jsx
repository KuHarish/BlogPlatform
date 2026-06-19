import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const BlogCard = ({ post }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border dark:border-slate-700 flex flex-col h-full">
      {post.image ? (
        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <span className="text-slate-400">No Image</span>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-slate-900 dark:text-white">
          <Link to={`/post/${post._id}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <span>By {post.author?.name || 'Unknown'}</span>
          <span className="mx-2">•</span>
          <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3 flex-grow" dangerouslySetInnerHTML={{ __html: post.content }}></p>
        <div className="mt-auto">
          <Link to={`/post/${post._id}`} className="text-primary font-medium hover:underline inline-flex items-center">
            Read More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
