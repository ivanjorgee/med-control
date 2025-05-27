
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Medicine, Location } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { MedicineSelect } from "./form/MedicineSelect";
import { QuantityField } from "./form/QuantityField";
import { LocationSelect } from "./form/LocationSelect";
import { FormActions } from "./form/FormActions";

interface DistributionFormProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onCreateDistribution: (data: any) => void;
  medicines: Medicine[];
  locations: Location[];
}

export const DistributionForm = ({ 
  isOpen, 
  setIsOpen, 
  onCreateDistribution,
  medicines,
  locations
}: DistributionFormProps) => {
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  
  const { toast } = useToast();
  const { isAdmin } = useAuth();
  
  // Get the selected medicine to show unit
  const selectedMedicine = medicines.find(med => med.id === selectedMedicineId);
  
  const handleCreateDistribution = () => {
    if (!selectedMedicineId) {
      toast({
        title: "Erro",
        description: "Selecione um medicamento",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedLocationId) {
      toast({
        title: "Erro",
        description: "Selecione uma unidade de destino",
        variant: "destructive"
      });
      return;
    }
    
    if (quantity <= 0) {
      toast({
        title: "Erro",
        description: "Quantidade deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }
    
    // Get the selected medicine to check quantity
    if (selectedMedicine && quantity > selectedMedicine.quantity) {
      toast({
        title: "Estoque insuficiente",
        description: `Quantidade disponível: ${selectedMedicine.quantity} ${selectedMedicine.measureUnit}`,
        variant: "destructive"
      });
      return;
    }
    
    onCreateDistribution({
      medicineId: selectedMedicineId,
      quantity,
      destinationLocationId: selectedLocationId
    });
    
    // Reset form
    setSelectedMedicineId("");
    setSelectedLocationId("");
    setQuantity(0);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Distribuição de Medicamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para registrar uma nova distribuição de medicamentos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <MedicineSelect 
            medicines={medicines} 
            selectedMedicineId={selectedMedicineId} 
            setSelectedMedicineId={setSelectedMedicineId} 
          />
          
          <QuantityField 
            quantity={quantity} 
            setQuantity={setQuantity} 
            selectedMedicine={selectedMedicine} 
          />
          
          <LocationSelect 
            locations={locations} 
            selectedLocationId={selectedLocationId} 
            setSelectedLocationId={setSelectedLocationId} 
          />
        </div>
        
        <DialogFooter>
          <FormActions 
            onCancel={() => setIsOpen(false)} 
            onSubmit={handleCreateDistribution} 
            isAdmin={isAdmin} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
