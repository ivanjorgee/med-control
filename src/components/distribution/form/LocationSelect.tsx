
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Location } from "@/types";

interface LocationSelectProps {
  locations: Location[];
  selectedLocationId: string;
  setSelectedLocationId: (value: string) => void;
}

export const LocationSelect = ({
  locations,
  selectedLocationId,
  setSelectedLocationId
}: LocationSelectProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="destination">Unidade de Destino</Label>
      <Select
        value={selectedLocationId}
        onValueChange={setSelectedLocationId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione a unidade de destino" />
        </SelectTrigger>
        <SelectContent>
          {locations
            .filter(location => location.status === 'active')
            .map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};
