import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import LoginPage from "./../pages/auth/LoginPage";
import DashboardPage from "./../pages/app/DashboardPage";
import NotFoundPage from "./../pages/NotFoundPage";
import ConfigPage from "../pages/app/ConfigPage";
import UploadPage from "../pages/app/UploadPage";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/config" element={<ConfigPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
