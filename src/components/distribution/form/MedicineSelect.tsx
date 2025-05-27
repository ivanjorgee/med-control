
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Medicine } from "@/types";

interface MedicineSelectProps {
  medicines: Medicine[];
  selectedMedicineId: string;
  setSelectedMedicineId: (value: string) => void;
}

export const MedicineSelect = ({ 
  medicines, 
  selectedMedicineId, 
  setSelectedMedicineId 
}: MedicineSelectProps) => {
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  
  // Filter out medicines with zero or negative quantity
  useEffect(() => {
    setAvailableMedicines(medicines.filter(med => med.quantity > 0 && med.status !== 'expired'));
  }, [medicines]);

  return (
    <div className="grid gap-2">
      <Label htmlFor="medicine">Medicamento</Label>
      <Select
        value={selectedMedicineId}
        onValueChange={setSelectedMedicineId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione o medicamento" />
        </SelectTrigger>
        <SelectContent>
          {availableMedicines.map(medicine => (
            <SelectItem key={medicine.id} value={medicine.id}>
              {medicine.name} - Lote: {medicine.batchNumber} - Disponível: {medicine.quantity} {medicine.measureUnit}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
