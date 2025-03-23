import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const { user, setUser } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  // Login function
  const authenticatedUser = (userData) => {
    setUser(userData); // UserContext handles persistence
  };

  // Logout function
  const removeUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authenticatedUser, removeUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
