import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X, User as UserIcon } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-primary dark:text-accent">
            DevBlog
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <>
                <Link to="/create" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Write a Blog
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                    <span>{user.name}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border dark:border-slate-700">
                      <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)} className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-primary">Login</Link>
                <Link to="/register" className="bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">Register</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className="p-2 mr-2">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {user ? (
              <>
                <Link to="/create" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Write a Blog</Link>
                <Link to="/profile" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Profile ({user.name})</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700">Login</Link>
                <Link to="/register" className="block px-4 py-2 text-primary font-medium hover:bg-slate-100 dark:hover:bg-slate-700">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
