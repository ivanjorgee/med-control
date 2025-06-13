
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirstAccessForm } from "@/components/login/FirstAccessForm";
import { RightPanel } from "@/components/login/RightPanel";

export default function FirstAccessPage() {
  const navigate = useNavigate();

  // Verificar se o sistema já foi configurado
  useEffect(() => {
    const setupComplete = localStorage.getItem("medcontrol-setup-complete");
    const users = localStorage.getItem("users");
    
    if (setupComplete === "true" && users) {
      const usersList = JSON.parse(users);
      if (usersList.length > 0) {
        navigate("/login", { replace: true });
      }
    }
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
