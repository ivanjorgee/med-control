
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Medicine } from "@/types";

interface QuantityFieldProps {
  quantity: number;
  setQuantity: (value: number) => void;
  selectedMedicine: Medicine | undefined;
}

export const QuantityField = ({
  quantity,
  setQuantity,
  selectedMedicine
}: QuantityFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="quantity">Quantidade</Label>
      <div className="flex items-center gap-2">
        <Input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
          min={1}
          max={selectedMedicine?.quantity || 999999}
        />
        <span className="text-sm text-muted-foreground">
          {selectedMedicine?.measureUnit || "unidades"}
        </span>
      </div>
      {selectedMedicine && (
        <p className="text-sm text-muted-foreground">
          Disponível: {selectedMedicine.quantity} {selectedMedicine.measureUnit}
        </p>
      )}
    </div>
  );
};
