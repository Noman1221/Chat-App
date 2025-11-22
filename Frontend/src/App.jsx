/* eslint-disable no-unused-vars */
import { useContext } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { authContext } from "./context/authContext";
import PrivateRoute from "./middleware/privateRoute";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import UserProfile from "./pages/userProfile";

function App() {
  const { user, loading } = useContext(authContext); // ADD loading

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/register" />} />
        <Route path="/register" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        <Route path="/userProfile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;