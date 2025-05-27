
import { StockStatusOverview } from "./StockStatusOverview";
import { MedicineStockChart } from "./MedicineStockChart";
import { useAuth } from "@/contexts/AuthContext";

export const DashboardOverview = () => {
  const { authUser } = useAuth();
  
  // Exibe diferentes componentes com base no papel do usuário
  const showStockChart = authUser?.role === "admin" || authUser?.role === "pharmacist";
  const showStatusOverview = true; // Todos os usuários podem ver isso
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {showStatusOverview && (
        <div className={showStockChart ? "" : "md:col-span-2"}>
          <StockStatusOverview />
        </div>
      )}
      
      {showStockChart && (
        <div>
          <MedicineStockChart />
        </div>
      )}
      
      {!showStockChart && !showStatusOverview && (
        <div className="col-span-2 bg-muted/20 p-10 rounded-lg text-center">
          <h3 className="text-lg font-medium">Sem gráficos disponíveis</h3>
          <p className="text-muted-foreground">
            Nenhum gráfico está disponível para o seu nível de acesso.
          </p>
        </div>
      )}
    </div>
  );
};
