
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useMedicines } from "@/contexts/MedicineContext";
import { useState, useEffect } from "react";

export const StockStatusOverview = () => {
  const { medicines } = useMedicines();
  const [statusData, setStatusData] = useState([
    { name: "Disponível", value: 0, color: "#22c55e" },
    { name: "Baixo Estoque", value: 0, color: "#f59e0b" },
    { name: "Crítico", value: 0, color: "#ef4444" },
    { name: "Vencido", value: 0, color: "#6b7280" },
  ]);

  useEffect(() => {
    if (medicines.length > 0) {
      const statusCounts = {
        available: 0,
        low: 0,
        critical: 0,
        expired: 0
      };

      medicines.forEach(medicine => {
        if (medicine.status === "available") statusCounts.available++;
        if (medicine.status === "low") statusCounts.low++;
        if (medicine.status === "critical") statusCounts.critical++;
        if (medicine.status === "expired") statusCounts.expired++;
      });

      setStatusData([
        { name: "Disponível", value: statusCounts.available, color: "#22c55e" },
        { name: "Baixo Estoque", value: statusCounts.low, color: "#f59e0b" },
        { name: "Crítico", value: statusCounts.critical, color: "#ef4444" },
        { name: "Vencido", value: statusCounts.expired, color: "#6b7280" },
      ]);
    }
  }, [medicines]);

  const hasData = statusData.some(item => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status do Estoque</CardTitle>
        <CardDescription>
          Visão geral da situação dos medicamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} medicamentos`, 'Quantidade']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[#1C1C1C]/70">
            <p className="text-lg font-medium">Sem dados disponíveis</p>
            <p className="text-sm text-muted-foreground">
              Adicione medicamentos para visualizar estatísticas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
