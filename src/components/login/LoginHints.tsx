
import { AlertCircle } from "lucide-react";
import { PopoverTrigger, Popover, PopoverContent } from "@/components/ui/popover";

export function LoginHints() {
  // Dicas de login para o usuário de teste
  const loginHints = [
    { role: "Administrador", email: "admin@medcontrol.com", password: "admin123" },
    { role: "Farmacêutico", email: "joao@medcontrol.com", password: "joao123" },
    { role: "Responsável UBS", email: "maria@medcontrol.com", password: "maria123" }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="text-center cursor-pointer">
          <p className="text-sm text-primary flex items-center justify-center">
            <AlertCircle className="h-4 w-4 mr-1" /> 
            Usuários para teste
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h3 className="font-medium">Usuários disponíveis para teste:</h3>
          <div className="space-y-2">
            {loginHints.map((hint, idx) => (
              <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                <p className="font-medium">{hint.role}</p>
                <p>Email: {hint.email}</p>
                <p>Senha: {hint.password}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
