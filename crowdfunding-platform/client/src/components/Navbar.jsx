import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LogOut, PlusCircle, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">FundRise</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'entrepreneur' && (
                  <Link to="/create-project" className="text-gray-700 hover:text-primary-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
                    <PlusCircle className="w-5 h-5 mr-1" />
                    Start a Project
                  </Link>
                )}
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
                  <UserIcon className="w-5 h-5 mr-1" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-primary-50 text-primary-700 hover:bg-primary-100 flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Log in
                </Link>
                <Link to="/register" className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
