import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

const Navbar = () => {
  const { state, logout } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Deseas Cerrar Sesion?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/dashboard">
        ForecastApp
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        {state.isAuthenticated && (
          <>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/upload">
                  Cargar Datos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/config">
                  Configuración
                </Link>
              </li>
            </ul>
            <span className="navbar-text me-3">{state?.user}</span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
