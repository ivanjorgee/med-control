
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
    console.log("🔍 Verificando se é primeiro acesso...");
    
    const setupComplete = localStorage.getItem("medcontrol-setup-complete");
    const users = localStorage.getItem("users");
    
    console.log("Setup complete:", setupComplete);
    console.log("Users exist:", !!users);
    
    if (setupComplete !== "true" || !users) {
      console.log("➡️ Redirecionando para primeiro acesso - setup não completo");
      navigate("/first-access", { replace: true });
      return;
    }
    
    try {
      const usersList = JSON.parse(users);
      if (usersList.length === 0) {
        console.log("➡️ Redirecionando para primeiro acesso - nenhum usuário");
        navigate("/first-access", { replace: true });
        return;
      }
      console.log("✅ Sistema configurado, usuários encontrados:", usersList.length);
    } catch (error) {
      console.error("❌ Erro ao processar lista de usuários:", error);
      navigate("/first-access", { replace: true });
      return;
    }
  }, [navigate]);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Usuário já autenticado, redirecionando para dashboard...");
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
