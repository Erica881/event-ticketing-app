'use client'

import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAccount } from 'wagmi'
import Navbar from "./components/Common/Navbar";
import CreateEventPage from "./components/Events/CreateEventPage";
import EventListPage from "./components/Events/EventListPage";
import MyTicketsPage from "./components/Tickets/MyTicketsPage";
import AboutUsPage from "./components/About/AboutUsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const account = useAccount();
  
  if (!isAuthenticated || account.status !== 'connected') {
    return <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
      <p className="text-gray-600 mb-4">Please connect your wallet to access this page</p>
    </div>;
  }
  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<EventListPage />} />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <ProtectedRoute>
                <MyTicketsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <AppContent />
        </Router>
      </EventProvider>
    </AuthProvider>
  );
}

//test