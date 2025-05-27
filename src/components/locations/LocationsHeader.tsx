
import { Button } from "@/components/ui/button";
import { LocationDialog } from "@/components/locations/LocationDialog";
import { Location } from "@/types";

interface LocationsHeaderProps {
  onLocationSaved: (savedLocation: Location) => void;
}

export const LocationsHeader = ({ onLocationSaved }: LocationsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Unidades</h1>
        <p className="text-muted-foreground">
          Cadastre e gerencie as unidades do sistema.
        </p>
      </div>
      <LocationDialog onLocationSaved={onLocationSaved} />
    </div>
  );
};
