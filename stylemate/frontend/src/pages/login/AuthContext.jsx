import { createContext, useContext, useState, useEffect } from "react";


const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("user_id", userData.user_id);
    localStorage.setItem("isAuthenticated", "true");
  };

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
