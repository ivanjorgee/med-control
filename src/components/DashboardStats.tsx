
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertTriangle, Calendar, Package, PackageCheck, Clock } from "lucide-react";
import { useMedicines } from "@/contexts/MedicineContext";
import { useAuth } from "@/contexts/AuthContext";
import { addMonths, isBefore, isAfter } from "date-fns";
import { useEffect, useState } from "react";

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
  const { authUser, isAdmin } = useAuth();
  const [distributedThisMonth, setDistributedThisMonth] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  
  // Filtrar medicamentos baseado na unidade do usuário
  const userMedicines = isAdmin ? medicines : medicines.filter(med => 
    med.locationId === authUser?.locationId
  );
  
  useEffect(() => {
    // Calcular distribuições do mês baseado nos dados salvos
    const savedDispensings = localStorage.getItem('medcontrol_dispensings');
    if (savedDispensings) {
      const dispensings = JSON.parse(savedDispensings);
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const thisMonthDispensings = dispensings.filter((dispensing: any) => {
        const dispensingDate = new Date(dispensing.created_at);
        const matchesLocation = isAdmin || !authUser?.locationId || dispensing.locationId === authUser.locationId;
        return dispensingDate.getMonth() === currentMonth && 
               dispensingDate.getFullYear() === currentYear &&
               matchesLocation;
      });
      
      const totalDistributed = thisMonthDispensings.reduce((sum: number, dispensing: any) => 
        sum + dispensing.quantity, 0
      );
      
      setDistributedThisMonth(totalDistributed);
    }

    // Contar solicitações pendentes (apenas para admin)
    if (isAdmin) {
      const savedRequests = localStorage.getItem('medcontrol_medication_requests');
      if (savedRequests) {
        const requests = JSON.parse(savedRequests);
        setPendingRequests(requests.length);
      }
    }
  }, [authUser, isAdmin]);
  
  // Calcula estatísticas
  const today = new Date();
  const threeMonthsLater = addMonths(today, 3);
  
  // Total de medicamentos em estoque
  const totalInStock = userMedicines.reduce((sum, med) => sum + med.quantity, 0);
  
  // Medicamentos próximos a vencer (próximos 3 meses)
  const expiringCount = userMedicines.filter(med => {
    const expirationDate = new Date(med.expirationDate);
    return expirationDate > today && expirationDate <= threeMonthsLater;
  }).length;
  
  // Medicamentos que necessitam reposição
  const needRestockCount = userMedicines.filter(med => 
    med.status === "low" || med.status === "critical"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <StatCard
        title="Total em Estoque"
        value={totalInStock}
        description={`${userMedicines.length} medicamentos${!isAdmin ? ' na sua unidade' : ''}`}
        icon={<Package className="h-4 w-4 text-[#0052CC]" />}
      />
      <StatCard
        title="Dispensados (mês)"
        value={distributedThisMonth}
        description={`No último mês${!isAdmin ? ' na sua unidade' : ''}`}
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
      {isAdmin && (
        <StatCard
          title="Solicitações Pendentes"
          value={pendingRequests}
          description="Aguardando aprovação"
          icon={<Clock className="h-4 w-4 text-[#FF6B6B]" />}
          className={pendingRequests > 0 ? "border-red-200 bg-red-50" : ""}
        />
      )}
    </div>
  );
}
