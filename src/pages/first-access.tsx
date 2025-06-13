
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirstAccessForm } from "@/components/login/FirstAccessForm";
import { RightPanel } from "@/components/login/RightPanel";
import { supabase } from "@/integrations/supabase/client";

export default function FirstAccessPage() {
  const navigate = useNavigate();

  // Verificar se o sistema já foi configurado
  useEffect(() => {
    const checkSystemSetup = async () => {
      console.log("🔍 Verificando se sistema já foi configurado...");
      
      try {
        // Verificar no banco de dados se já existem dados
        const { data: locations, error: locationsError } = await supabase
          .from('locations')
          .select('*')
          .limit(1);

        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('*')
          .eq('role', 'admin')
          .limit(1);

        // Se temos dados no banco, o sistema já foi configurado
        if (!locationsError && !usersError && locations && users && locations.length > 0 && users.length > 0) {
          console.log("✅ Sistema já configurado no banco, redirecionando para login");
          localStorage.setItem("medcontrol-setup-complete", "true");
          navigate("/login", { replace: true });
          return;
        }

        // Verificar localStorage como backup
        const setupComplete = localStorage.getItem("medcontrol-setup-complete");
        const localUsers = localStorage.getItem("users");
        const localLocations = localStorage.getItem("medcontrol_locations");
        
        if (setupComplete === "true" && localUsers && localLocations) {
          try {
            const usersList = JSON.parse(localUsers);
            const locationsList = JSON.parse(localLocations);
            
            if (usersList.length > 0 && locationsList.length > 0) {
              console.log("✅ Sistema já configurado localmente, redirecionando para login");
              navigate("/login", { replace: true });
              return;
            }
          } catch (error) {
            console.error("❌ Erro ao verificar dados locais:", error);
          }
        }
        
        console.log("⚠️ Sistema não configurado, permanecendo na página de configuração inicial");
      } catch (error) {
        console.error("❌ Erro ao verificar configuração:", error);
      }
    };

    checkSystemSetup();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-stretch bg-gradient-to-br from-blue-50 to-white">
      {/* Left panel - First Access Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">MedControl</h1>
            <p className="text-gray-600">
              Configure o sistema pela primeira vez
            </p>
          </div>
          <FirstAccessForm />
        </div>
      </div>

      {/* Right panel - Info and Features */}
      <RightPanel />
    </div>
  );
}
