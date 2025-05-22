import React, { createContext, useContext } from "react";
import { useAccount } from 'wagmi';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const account = useAccount();

  const isAuthenticated = account.status === 'connected' && Boolean(account.addresses?.[0]);

  const logout = () => {
    // Wallet disconnection is handled by the wallet connection component
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
