import { useState } from "react";
import DashboardPage from "./pages/app/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <DashboardPage />
  ) : (
    <LoginPage onLogin={() => setIsLoggedIn(true)} />
  );
};

export default App;
