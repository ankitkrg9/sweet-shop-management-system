import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 🔐 Decode JWT
      const token = res.data.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (isAdminLogin && role !== "ADMIN") {
        alert("You must login using ADMIN credentials");
        return;
      }

      if (!isAdminLogin && role === "ADMIN") {
        alert("Please check 'Login as Admin'");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="admin-checkbox">
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={() => setIsAdminLogin(!isAdminLogin)}
            />
            <label>Login as Admin</label>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="login-links">
          New user? <a href="/register">Register here</a>
        </div>

        <div className="login-info">
          Admins must check "Login as Admin" before logging in.
        </div>
      </div>
    </div>
  );
}

export default Login;
