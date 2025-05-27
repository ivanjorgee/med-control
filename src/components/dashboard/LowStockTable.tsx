
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";
import { useMedicines } from "@/contexts/MedicineContext";
import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";

export const LowStockTable = () => {
  const { medicines } = useMedicines();
  
  const lowStockMedicines = medicines.filter(med => 
    med.status === "low" || med.status === "critical"
  ).sort((a, b) => {
    // Prioritize critical, then sort by quantity
    if (a.status === "critical" && b.status !== "critical") return -1;
    if (a.status !== "critical" && b.status === "critical") return 1;
    return a.quantity - b.quantity;
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Medicamentos em Baixo Estoque</CardTitle>
          <CardDescription>
            Medicamentos que precisam de reposição
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/stock?statusFilter=low,critical">Ver Todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  <div className="flex flex-col items-center justify-center text-[#1C1C1C]/70">
                    <Package className="h-8 w-8 mb-2" />
                    <p>Sem medicamentos em baixo estoque</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              lowStockMedicines.slice(0, 5).map(med => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.quantity} {med.measureUnit}</TableCell>
                  <TableCell>
                    <StatusBadge status={med.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
