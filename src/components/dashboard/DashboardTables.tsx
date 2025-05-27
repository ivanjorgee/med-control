
import { LowStockTable } from "./LowStockTable";
import { ExpiringMedicinesTable } from "./ExpiringMedicinesTable";
import { PendingDistributionsTable } from "./PendingDistributionsTable";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardTables = () => {
  const { authUser } = useAuth();
  
  // Determina quais tabelas exibir com base no papel do usuário
  const showLowStock = authUser?.role === "admin" || authUser?.role === "pharmacist";
  const showExpiring = true; // Todos os usuários podem ver isso
  const showPendingDistributions = authUser?.role !== "health_unit"; // Todos exceto unidades de saúde
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {showLowStock && <LowStockTable />}
        {showExpiring && <ExpiringMedicinesTable />}
        
        {/* Se nenhuma tabela for exibida na primeira linha, preenche com espaço vazio */}
        {!showLowStock && !showExpiring && (
          <div className="col-span-2"></div>
        )}
      </div>
      
      <div className="mt-6">
        {showPendingDistributions && <PendingDistributionsTable />}
      </div>
    </>
  );
};
