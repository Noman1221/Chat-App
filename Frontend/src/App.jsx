/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// Component names should be PascalCase
import "./App.css";
import { authContext } from "./context/authContext";
import PrivateRoute from "./middleware/privateRoute";
import HomePage from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import ProfilePage from "./pages/profilePage";
function App() {
  const auContext = useContext(authContext);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
