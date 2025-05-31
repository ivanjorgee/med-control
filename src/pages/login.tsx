
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoginHeader } from "@/components/login/LoginHeader";
import { LoginForm } from "@/components/login/LoginForm";
import { RightPanel } from "@/components/login/RightPanel";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Verificar se é o primeiro acesso
  useEffect(() => {
    const setupComplete = localStorage.getItem("medcontrol-setup-complete");
    const users = localStorage.getItem("users");
    
    if (setupComplete !== "true" || !users) {
      navigate("/first-access", { replace: true });
      return;
    }
    
    const usersList = JSON.parse(users);
    if (usersList.length === 0) {
      navigate("/first-access", { replace: true });
      return;
    }
  }, [navigate]);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuário já autenticado, redirecionando...");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-blue-50 to-white">
      {/* Left panel - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>

      {/* Right panel - Info and Features */}
      <RightPanel />
    </div>
  );
}
