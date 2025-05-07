
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { UserPlus, LogIn, User } from 'lucide-react';

const Index: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl w-full text-center space-y-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-brand-900 sm:text-5xl">
          Welcome to UserHub
        </h1>
        
        <p className="text-xl text-muted-foreground">
          A simple, secure way to manage user authentication and profiles.
        </p>
        
        {isAuthenticated ? (
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-white shadow-md">
              <h2 className="text-2xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
              <p className="mb-4 text-gray-600">You're currently logged in with {user?.email}</p>
              
              <Link to="/profile">
                <Button className="bg-brand-600 hover:bg-brand-700 gap-1.5">
                  <User size={18} />
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8">
              <div className="p-6 rounded-lg bg-white shadow-md">
                <h2 className="text-xl font-semibold mb-2">New User?</h2>
                <p className="mb-4 text-gray-600">Create a new account to get started with UserHub</p>
                <Link to="/register">
                  <Button className="bg-brand-600 hover:bg-brand-700 w-full gap-1.5">
                    <UserPlus size={18} />
                    Register
                  </Button>
                </Link>
              </div>
              
              <div className="p-6 rounded-lg bg-white shadow-md">
                <h2 className="text-xl font-semibold mb-2">Returning User?</h2>
                <p className="mb-4 text-gray-600">Sign in to access your account and profile</p>
                <Link to="/login">
                  <Button className="bg-brand-600 hover:bg-brand-700 w-full gap-1.5">
                    <LogIn size={18} />
                    Login
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">About UserHub</h3>
              <p className="text-gray-600">
                UserHub provides a secure and intuitive interface for user account management.
                Register an account to explore the full functionality of this demo application.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
