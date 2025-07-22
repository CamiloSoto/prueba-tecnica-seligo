import { useState } from "react";
import api from "../../services/api";

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("admin@test.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      onLogin(); // Redirige al dashboard
    } catch (err) {
      setError("Credenciales inválidas");
      console.log(err);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h3>Iniciar Sesión</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="email"
        className="form-control mt-3"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mt-3"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="btn btn-primary w-100 mt-4" onClick={handleLogin}>
        Entrar
      </button>
    </div>
  );
};

export default LoginPage;
