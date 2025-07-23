import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4">404</h1>
      <p className="lead">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/dashboard" className="btn btn-primary">
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
