
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { mockLocations } from "@/data/mockLocations";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateReport } from "@/utils/reportGenerator";

interface ReportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportTypes = [
  { id: "medicines", label: "Medicamentos" },
  { id: "distributions", label: "Distribuições" },
  { id: "expirations", label: "Vencimentos" },
  { id: "inventory", label: "Inventário" },
  { id: "users", label: "Usuários e Permissões" },
];

export function ReportExportDialog({ open, onOpenChange }: ReportExportDialogProps) {
  const { toast } = useToast();
  const { authUser, isAdmin } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState<string>(authUser?.locationId || "all");
  const [selectedReports, setSelectedReports] = useState<string[]>(["medicines"]);

  const handleReportTypeToggle = (reportId: string) => {
    setSelectedReports((current) =>
      current.includes(reportId)
        ? current.filter((id) => id !== reportId)
        : [...current, reportId]
    );
  };

  const handleExportReport = () => {
    if (!startDate || !endDate) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, selecione ambas as datas para gerar o relatório.",
      });
      return;
    }

    if (selectedReports.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, selecione pelo menos um tipo de relatório.",
      });
      return;
    }

    try {
      generateReport({
        startDate,
        endDate,
        locationId: location,
        reportTypes: selectedReports,
        isAdmin
      });
      
      toast({
        title: "Sucesso!",
        description: "Relatório exportado com sucesso!",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Erro ao exportar relatório. Tente novamente."
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exportar Relatório
          </DialogTitle>
          <DialogDescription>
            Configure as opções para gerar o relatório em PDF.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Data inicial */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data inicial</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Data final */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Data final</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Seleção de local (apenas para admin) */}
          {isAdmin && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Local</label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o local" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os locais</SelectItem>
                  {mockLocations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Tipos de relatório */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Incluir no relatório</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {reportTypes.map((report) => (
                <div key={report.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={report.id} 
                    checked={selectedReports.includes(report.id)}
                    onCheckedChange={() => handleReportTypeToggle(report.id)}
                  />
                  <label htmlFor={report.id} className="text-sm cursor-pointer">
                    {report.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExportReport}>
            Exportar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
