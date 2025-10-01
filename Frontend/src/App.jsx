/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
// Component names should be PascalCase
import "react-loading-skeleton/dist/skeleton.css";
import "./App.css";
import { authContext } from "./context/authContext";
import PrivateRoute from "./middleware/privateRoute";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
import UserProfile from "./pages/userProfile";
function App() {

  const { user } = useContext(authContext);


  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/register" />} />
        <Route path="/register" element={<LoginPage />} />
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
