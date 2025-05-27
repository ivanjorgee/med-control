
import { SystemFeatures } from "./SystemFeatures";
import { SystemMessages } from "./SystemMessages";

export function RightPanel() {
  return (
    <div className="hidden md:block md:w-1/2 bg-primary p-10 text-white">
      <div className="h-full flex flex-col">
        <div className="flex-grow space-y-8">
          <div>
            <h2 className="text-3xl font-bold mb-4">MedControl</h2>
            <p className="text-lg opacity-90">
              Sistema completo para gestão de medicamentos e controle de estoque para clínicas e hospitais.
            </p>
          </div>

          <SystemFeatures />
        </div>

        <div className="mt-auto">
          <h3 className="text-xl font-medium border-b border-white/20 pb-2 mb-4">
            Avisos do Sistema
          </h3>
          
          <SystemMessages />
        </div>
        
        <div className="mt-8 text-center opacity-80 text-sm">
          <p>© 2025 MedControl. Todos os direitos reservados. v2.5.0</p>
        </div>
      </div>
    </div>
  );
}
