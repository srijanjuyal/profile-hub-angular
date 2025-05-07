
import React, { createContext, useState, useContext, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

// Define user type
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user storage for this demo (in a real app, you'd use a backend API)
const mockUsers: Record<string, { id: string; email: string; name: string; password: string; avatar?: string }> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string, name: string) => {
    // Simulating API call delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check if user already exists
    if (Object.values(mockUsers).some(u => u.email === email)) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      throw new Error("User already exists");
    }
    
    // Create new user
    const id = `user_${Date.now()}`;
    const newUser = { id, email, name, password };
    mockUsers[id] = newUser;
    
    // Set current user (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    toast({
      title: "Registration successful",
      description: "Welcome to your new account!",
    });
  };

  const login = async (email: string, password: string) => {
    // Simulating API call delay
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Find user by email
    const foundUser = Object.values(mockUsers).find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      setIsLoading(false);
      toast({
        title: "Login failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      throw new Error("Invalid credentials");
    }
    
    // Set current user (excluding password)
    const { password: _, ...userWithoutPassword } = foundUser;
    setUser(userWithoutPassword);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    setIsLoading(false);
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    if (user && user.id) {
      const updatedUser = { ...user, ...userData };
      
      // Update in mock DB
      if (mockUsers[user.id]) {
        mockUsers[user.id] = { ...mockUsers[user.id], ...userData };
      }
      
      // Update current session
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
