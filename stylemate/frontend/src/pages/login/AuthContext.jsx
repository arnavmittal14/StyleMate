import { createContext, useContext, useState, useEffect } from "react";

// Create Context
const AuthContext = createContext();

// Custom Hook to use Auth
export function useAuth() {
  return useContext(AuthContext);
}

// Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check local storage for saved login
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = (username) => {
    const userData = { name: username };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", "true");
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
