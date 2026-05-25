import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(user);
  return (
    <div className="navbar">
      <h2 onClick={() => navigate("/")}>📚 StudyShare</h2>
      <div>
        <Link to="/">Browse</Link>
        {user ? (
          <>
            <Link to="/upload">Upload</Link>
            <Link to="/dashboard">Dashboard</Link>
            {user?.role === "admin" && <Link to="/admin">Admin</Link>}
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Logout ({user.name})
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </div>
  );
}
