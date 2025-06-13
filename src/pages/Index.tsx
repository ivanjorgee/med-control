
import { useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardTables } from "@/components/dashboard/DashboardTables";
import { cleanupLocalStorage } from "@/utils/cleanupLocalStorage";

const Index = () => {
  useEffect(() => {
    // Limpar dados antigos do localStorage na primeira carga
    cleanupLocalStorage();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader />
        <DashboardStats />
        <DashboardOverview />
        <DashboardTables />
      </div>
    </MainLayout>
  );
};

export default Index;
