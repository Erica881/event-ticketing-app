import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "../interfaces";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string) => void; // Simulate login
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("authToken"); // Check local storage for persisted login
  });
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email: string) => {
    // Simulate API call and token generation
    const mockToken = "fake-jwt-token";
    const mockUser: User = { id: "user1", email };
    localStorage.setItem("authToken", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsAuthenticated(true);
    setUser(mockUser);
    // In a real app, you'd redirect here or in the LoginPage component
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    // In a real app, you'd redirect to login or home
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
