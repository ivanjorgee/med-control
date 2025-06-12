
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit } from "lucide-react";
import { Location } from "@/types";
import { LocationForm } from "./location-dialog/LocationForm";

interface LocationDialogProps {
  location?: Location;
  isEditing?: boolean;
  onLocationSaved: (location: Location) => void;
  triggerButton?: React.ReactNode;
}

export function LocationDialog({ location, isEditing = false, onLocationSaved, triggerButton }: LocationDialogProps) {
  const [open, setOpen] = useState(false);

  const handleLocationSubmit = (savedLocation: Location) => {
    // If it's a new location, generate a valid UUID without prefix
    if (!isEditing || !savedLocation.id) {
      savedLocation.id = uuidv4(); // UUID sem prefixo
    }
    
    // Pass the saved location to the parent component
    onLocationSaved(savedLocation);
    
    // Close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton ? triggerButton : (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nova Unidade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Unidade" : "Adicionar Nova Unidade"}</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para {isEditing ? "atualizar a" : "criar uma nova"} unidade de saúde.
          </DialogDescription>
        </DialogHeader>
        <LocationForm 
          location={location}
          isEditing={isEditing}
          onLocationSaved={handleLocationSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
