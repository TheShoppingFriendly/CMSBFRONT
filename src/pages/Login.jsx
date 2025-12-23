import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Admin Login</h2>
        <p style={styles.subtitle}>Sign in to access the dashboard</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2c3e50, #4ca1af)"
  },
  card: {
    width: "100%",
    maxWidth: "380px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
  },
  title: {
    margin: 0,
    marginBottom: "8px",
    fontSize: "26px",
    textAlign: "center",
    color: "#2c3e50"
  },
  subtitle: {
    margin: 0,
    marginBottom: "24px",
    fontSize: "14px",
    textAlign: "center",
    color: "#7f8c8d"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },
  input: {
    padding: "12px 14px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #dcdcdc",
    outline: "none",
    transition: "border 0.2s",
  },
  button: {
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2c3e50",
    color: "#fff",
    marginTop: "10px",
    transition: "background-color 0.2s"
  },
  error: {
    color: "#e74c3c",
    fontSize: "13px",
    textAlign: "center",
    marginTop: "4px"
  }
};

export default Login;
