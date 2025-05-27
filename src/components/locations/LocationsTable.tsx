
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package, Building } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Location, LocationType } from "@/types";
import { LocationDialog } from "@/components/locations/LocationDialog";

interface LocationsTableProps {
  locations: Location[];
  isLoading: boolean;
  onDelete: (locationId: string) => void;
  onLocationSaved: (savedLocation: Location) => void;
  locationTypeLabels: Record<LocationType, string>;
}

export const LocationsTable = ({
  locations,
  isLoading,
  onDelete,
  onLocationSaved,
  locationTypeLabels,
}: LocationsTableProps) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Carregando unidades...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Nome</TableHead>
            <TableHead className="hidden md:table-cell">Tipo</TableHead>
            <TableHead className="hidden md:table-cell">Cidade/UF</TableHead>
            <TableHead className="hidden lg:table-cell">Criado em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length > 0 ? (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  <div className="font-medium">{location.name}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs md:hidden">
                    {locationTypeLabels[location.type]} • {location.city}/{location.state}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{locationTypeLabels[location.type]}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {location.city}/{location.state}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {format(new Date(location.createdAt), "dd/MM/yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={location.status === "active" ? "default" : "secondary"}>
                    {location.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm"
                    asChild
                    className="flex items-center gap-1 whitespace-nowrap"
                  >
                    <Link to={`/stock?locationId=${location.id}`}>
                      <Package className="h-4 w-4" />
                      <span className="hidden sm:inline">Ver Estoque</span>
                    </Link>
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <LocationDialog 
                      location={location} 
                      isEditing={true} 
                      onLocationSaved={onLocationSaved}
                      triggerButton={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button variant="ghost" size="sm" onClick={() => onDelete(location.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Building className="h-12 w-12 mb-2" />
                  <h3 className="text-lg font-medium">Nenhuma unidade encontrada</h3>
                  <p>Adicione uma nova unidade para começar</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
