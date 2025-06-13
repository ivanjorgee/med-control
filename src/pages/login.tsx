
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
    const checkSystemSetup = async () => {
      console.log("🔍 Verificando configuração do sistema...");
      
      const setupComplete = localStorage.getItem("medcontrol-setup-complete");
      const users = localStorage.getItem("users");
      const locations = localStorage.getItem("medcontrol_locations");
      
      console.log("Setup complete:", setupComplete);
      console.log("Users exist:", !!users);
      console.log("Locations exist:", !!locations);
      
      // Só redireciona para first-access se realmente não estiver configurado
      if (setupComplete !== "true") {
        console.log("❌ Setup não marcado como completo, redirecionando para configuração inicial");
        navigate("/first-access", { replace: true });
        return;
      }
      
      if (!users || !locations) {
        console.log("❌ Dados ausentes, redirecionando para configuração inicial");
        navigate("/first-access", { replace: true });
        return;
      }
      
      try {
        const usersList = JSON.parse(users);
        const locationsList = JSON.parse(locations);
        
        if (usersList.length === 0 || locationsList.length === 0) {
          console.log("❌ Listas vazias, redirecionando para configuração inicial");
          navigate("/first-access", { replace: true });
          return;
        }
        
        console.log("✅ Sistema configurado corretamente, permanecendo na página de login");
      } catch (error) {
        console.error("❌ Erro ao parsear dados:", error);
        navigate("/first-access", { replace: true });
      }
    };

    checkSystemSetup();
  }, [navigate]);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Usuário já autenticado, redirecionando...");
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
