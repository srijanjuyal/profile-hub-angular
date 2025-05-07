
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, User, Home } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-brand-700">UserHub</Link>
          
          <nav className="flex items-center gap-4">
            <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-brand-700' : 'text-gray-600 hover:text-brand-700'}`}>
              <span className="flex items-center gap-1.5">
                <Home size={18} />
                <span>Home</span>
              </span>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" className={`text-sm font-medium ${location.pathname === '/profile' ? 'text-brand-700' : 'text-gray-600 hover:text-brand-700'}`}>
                  <span className="flex items-center gap-1.5">
                    <User size={18} />
                    <span>Profile</span>
                  </span>
                </Link>
                <Button variant="outline" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <LogIn size={18} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-1.5">
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} UserHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
