
import { AppLogo } from "@/components/AppLogo";

export function LoginHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <LogoContainer />
        <AppLogo />
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao MedControl</h1>
        <p className="text-gray-600 mt-2">
          Acesse o sistema de controle de medicamentos e gerencie seu estoque
        </p>
      </div>
    </div>
  );
}

function LogoContainer() {
  return (
    <div className="flex items-center justify-center gap-6 mb-4">
      <img 
        src="/lovable-uploads/a9b2c671-4ebc-40fd-bccc-770023fa0df9.png" 
        alt="Prefeitura Municipal de São João do Araguaia" 
        className="h-24 object-contain"
      />
      <img 
        src="/lovable-uploads/12c04d39-ea85-4e5b-8cfa-8563284f1ed5.png" 
        alt="Secretaria Municipal de Saúde e Saneamento" 
        className="h-24 object-contain"
      />
    </div>
  );
}
