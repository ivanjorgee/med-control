
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useState } from "react";
import { ReportExportDialog } from "@/components/ReportExportDialog";

export const DashboardHeader = () => {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de medicamentos.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setExportDialogOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <ReportExportDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen} 
      />
    </>
  );
};
