
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

export const MedicineStockChart = () => {
  // Array vazio - será preenchido com dados reais no futuro
  const chartData = [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimentação de Medicamentos</CardTitle>
        <CardDescription>
          Histórico dos últimos 5 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recebidos" fill="#1e88e5" name="Recebidos" />
              <Bar dataKey="distribuidos" fill="#43a047" name="Distribuídos" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Sem dados disponíveis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
