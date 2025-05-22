import React, { JSX } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import LoginPage from "./components/Auth/LoginPage";
import CreateEventPage from "./components/Events/CreateEventPage";
import EventListPage from "./components/Events/EventListPage";
import MyTicketsPage from "./components/Tickets/MyTicketsPage";
import AboutUsPage from "./components/About/AboutUsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import "./App.css"; // Global styles

// ProtectedRoute component
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* Redirect unknown routes to home */}
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <EventProvider>
        <Router>
          <AppContent />
        </Router>
      </EventProvider>
    </AuthProvider>
  );
};

export default App;
