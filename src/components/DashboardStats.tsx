
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, Calendar, Package, PackageCheck } from "lucide-react";
import { useMedicines } from "@/contexts/MedicineContext";
import { addMonths, isBefore, isAfter } from "date-fns";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  className?: string;
}

export function StatCard({ title, value, description, icon, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-[#1C1C1C]">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#1C1C1C]">{value}</div>
        {description && (
          <CardDescription className="mt-1">{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const { medicines } = useMedicines();
  
  // Calcula estatísticas
  const today = new Date();
  const threeMonthsLater = addMonths(today, 3);
  
  // Total de medicamentos em estoque
  const totalInStock = medicines.reduce((sum, med) => sum + med.quantity, 0);
  
  // Total distribuído no mês (placeholder - em um sistema real isso viria de registros de distribuição)
  const distributedThisMonth = 0;
  
  // Medicamentos próximos a vencer (próximos 3 meses)
  const expiringCount = medicines.filter(med => {
    const expirationDate = new Date(med.expirationDate);
    return expirationDate > today && expirationDate <= threeMonthsLater;
  }).length;
  
  // Medicamentos que necessitam reposição
  const needRestockCount = medicines.filter(med => 
    med.status === "low" || med.status === "critical"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total em Estoque"
        value={totalInStock}
        description={`${medicines.length} medicamentos cadastrados`}
        icon={<Package className="h-4 w-4 text-[#0052CC]" />}
      />
      <StatCard
        title="Distribuídos (mês)"
        value={distributedThisMonth}
        description="No último mês"
        icon={<PackageCheck className="h-4 w-4 text-[#0052CC]" />}
      />
      <StatCard
        title="Próximos a Vencer"
        value={expiringCount}
        description="Nos próximos 3 meses"
        icon={<Calendar className="h-4 w-4 text-[#FFC107]" />}
      />
      <StatCard
        title="Necessitam Reposição"
        value={needRestockCount}
        description="Em baixo estoque"
        icon={<AlertTriangle className="h-4 w-4 text-[#DC3545]" />}
      />
    </div>
  );
}
