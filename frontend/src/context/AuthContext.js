import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const loadUser = async () => {
      if (!token) return;

      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await axios.get("/api/auth/me");
        setUser(res.data);
      } catch (err) {
        logout();
      }
    };

    loadUser();
  }, [token]);

  const login = (tok, usr) => {
    localStorage.setItem("token", tok);
    setToken(tok);
    setUser(usr);
    axios.defaults.headers.common["Authorization"] = `Bearer ${tok}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
