
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationType } from "@/types";

interface LocationTypeSelectProps {
  value: LocationType;
  onChange: (value: LocationType) => void;
  locationTypeLabels: Record<LocationType, string>;
}

export function LocationTypeSelect({ value, onChange, locationTypeLabels }: LocationTypeSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      <Label htmlFor="type">Tipo de Unidade <span className="text-destructive">*</span></Label>
      <Select 
        value={value} 
        onValueChange={(value) => onChange(value as LocationType)}
      >
        <SelectTrigger id="type">
          <SelectValue placeholder="Selecione o tipo" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(locationTypeLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
