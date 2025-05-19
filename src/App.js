import React, { useState, useEffect } from 'react';
import Books from "./components/Books";
import Home from "./components/Home";
import Login from "./components/Login";
import Students from "./components/Students";
import Transactions from "./components/Transactions";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BookContextProvider from './context/BookContextProvider';
import StudentContextProvider from './context/StudentContextProvider';
import LSContextProvider from './context/LSContextProvider';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (token) => {
    const userData = localStorage.getItem('user');
    setUser(JSON.parse(userData));
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };


  return (
    <>
      <LSContextProvider>
        <BookContextProvider>
          <StudentContextProvider>
            <Router>
              <AppLayout isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} />

              <Routes>
                <Route
                  path="/login"
                  element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/books"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Books />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/students"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Students />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Transactions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />                
              </Routes>
            </Router>
          </StudentContextProvider>
        </BookContextProvider>
      </LSContextProvider>
    </>
  );
}

function AppLayout({ isAuthenticated, user, onLogout }) {
  const location = useLocation();

  return (
    <>
      {isAuthenticated && location.pathname !== '/login' && (
        <Navbar onLogout={onLogout} username={user?.username} />
      )}
    </>
  );
}


export default App;
