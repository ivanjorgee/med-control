
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addMonths, differenceInDays, format, isBefore, parseISO } from "date-fns";
import { Calendar, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useMedicines } from "@/contexts/MedicineContext";

const ExpirationPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expirationStats, setExpirationStats] = useState([
    { name: "Vencidos", count: 0, status: "expired" },
    { name: "Críticos (<1 mês)", count: 0, status: "critical" },
    { name: "Atenção (1-3 meses)", count: 0, status: "warning" },
    { name: "Próximos (3-6 meses)", count: 0, status: "notice" },
    { name: "Seguros (>6 meses)", count: 0, status: "safe" }
  ]);
  
  const { medicines } = useMedicines();
  
  const today = new Date();
  const oneMonthLater = addMonths(today, 1);
  const threeMonthsLater = addMonths(today, 3);
  const sixMonthsLater = addMonths(today, 6);
  
  useEffect(() => {
    // Calculate statistics
    const stats = [
      { name: "Vencidos", count: 0, status: "expired" },
      { name: "Críticos (<1 mês)", count: 0, status: "critical" },
      { name: "Atenção (1-3 meses)", count: 0, status: "warning" },
      { name: "Próximos (3-6 meses)", count: 0, status: "notice" },
      { name: "Seguros (>6 meses)", count: 0, status: "safe" }
    ];
    
    medicines.forEach(med => {
      const expirationDate = new Date(med.expirationDate);
      const status = getExpirationStatus(med.expirationDate);
      
      // Update counts
      const statIndex = stats.findIndex(s => s.status === status);
      if (statIndex !== -1) {
        stats[statIndex].count += 1;
      }
    });
    
    setExpirationStats(stats);
  }, [medicines]);
  
  const getExpirationStatus = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    if (isBefore(expDate, today)) return "expired";
    if (isBefore(expDate, oneMonthLater)) return "critical";
    if (isBefore(expDate, threeMonthsLater)) return "warning";
    if (isBefore(expDate, sixMonthsLater)) return "notice";
    return "safe";
  };
  
  const getExpirationStatusLabel = (status: string) => {
    switch (status) {
      case "expired": return "Vencido";
      case "critical": return "Crítico (< 1 mês)";
      case "warning": return "Atenção (1-3 meses)";
      case "notice": return "Próximo (3-6 meses)";
      case "safe": return "Seguro (> 6 meses)";
      default: return status;
    }
  };

  const getExpirationStatusColor = (status: string) => {
    switch (status) {
      case "expired": return "#ef4444";
      case "critical": return "#f97316";
      case "warning": return "#f59e0b";
      case "notice": return "#3b82f6";
      case "safe": return "#22c55e";
      default: return "#64748b";
    }
  };

  // Process medicines to add expiration information
  const processedMedicines = medicines.map(medicine => {
    const expirationDate = new Date(medicine.expirationDate);
    const daysUntilExpiration = differenceInDays(expirationDate, today);
    const expirationStatus = getExpirationStatus(medicine.expirationDate);
    
    return {
      ...medicine,
      daysUntilExpiration,
      expirationStatus
    };
  }).sort((a, b) => a.daysUntilExpiration - b.daysUntilExpiration);

  const filteredMedicines = processedMedicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    medicine.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Controle de Vencimentos</h1>
          <p className="text-muted-foreground">
            Monitore os prazos de vencimento dos medicamentos em estoque.
          </p>
        </div>
        <Button>
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Visão por Vencimento</CardTitle>
            <CardDescription>
              Distribuição de medicamentos por prazo de vencimento
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expirationStats}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {expirationStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getExpirationStatusColor(entry.status)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>Medicamentos Próximos ao Vencimento</CardTitle>
            <CardDescription>
              Medicamentos que vencerão nos próximos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou lote..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Fabricante</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedicines.length > 0 ? (
                  filteredMedicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-medium">{medicine.name}</TableCell>
                      <TableCell>{medicine.batchNumber}</TableCell>
                      <TableCell>{medicine.manufacturer}</TableCell>
                      <TableCell>{medicine.quantity} {medicine.measureUnit}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(new Date(medicine.expirationDate), "dd/MM/yyyy")}</span>
                          <span className="text-xs text-muted-foreground">
                            {medicine.daysUntilExpiration < 0 
                              ? `Vencido há ${Math.abs(medicine.daysUntilExpiration)} dias` 
                              : `Vence em ${medicine.daysUntilExpiration} dias`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: getExpirationStatusColor(medicine.expirationStatus) }}
                          ></div>
                          <span>{getExpirationStatusLabel(medicine.expirationStatus)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="h-12 w-12 mb-2" />
                        <h3 className="text-lg font-medium">Nenhum medicamento encontrado</h3>
                        <p>Nenhum medicamento corresponde aos critérios de busca</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ExpirationPage;
