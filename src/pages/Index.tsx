
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { DashboardTables } from "@/components/dashboard/DashboardTables";

const Index = () => {
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
