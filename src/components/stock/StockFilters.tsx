import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, CheckSquare, X } from "lucide-react";
import { Location } from "@/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface StockFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  selectedLocation: string | null;
  setSelectedLocation: (value: string) => void;
  selectedLocations: string[];
  setSelectedLocations: (value: string[]) => void;
  categories: string[];
  locations: Location[];
}

export function StockFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  selectedLocation,
  setSelectedLocation,
  selectedLocations,
  setSelectedLocations,
  categories,
  locations
}: StockFiltersProps) {
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);

  const handleLocationToggle = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter(id => id !== locationId));
    } else {
      setSelectedLocations([...selectedLocations, locationId]);
    }
  };

  const clearLocationSelection = () => {
    setSelectedLocations([]);
  };

  const getSelectedLocationsLabel = () => {
    if (selectedLocations.length === 0) return "Todas as unidades";
    if (selectedLocations.length === 1) {
      const location = locations.find(l => l.id === selectedLocations[0]);
      return location ? location.name : "Unidade selecionada";
    }
    return `${selectedLocations.length} unidades selecionadas`;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-[#1C1C1C]/50" />
            <Input
              placeholder="Buscar por nome ou lote..."
              className="pl-8 border-[#C4C4C4]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="border-[#C4C4C4]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-[#C4C4C4]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="low">Baixo Estoque</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
              <SelectItem value="expired">Vencido</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="justify-between border-[#C4C4C4] w-full"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  {getSelectedLocationsLabel()}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b flex justify-between items-center">
                <h4 className="font-medium">Filtrar por unidades</h4>
                {selectedLocations.length > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearLocationSelection}
                    className="h-8 px-2 text-sm"
                  >
                    <X className="h-4 w-4 mr-1" /> Limpar
                  </Button>
                )}
              </div>
              <div className="py-2 max-h-[300px] overflow-auto">
                {locations.map((location) => (
                  <div 
                    key={location.id} 
                    className="flex items-center space-x-2 p-3 hover:bg-gray-50"
                  >
                    <Checkbox 
                      id={`location-${location.id}`}
                      checked={selectedLocations.includes(location.id)}
                      onCheckedChange={() => handleLocationToggle(location.id)}
                    />
                    <label 
                      htmlFor={`location-${location.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                    >
                      {location.name}
                    </label>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t flex justify-end">
                <Button 
                  size="sm"
                  onClick={() => setIsLocationPopoverOpen(false)}
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mostrar badges para unidades selecionadas */}
        {selectedLocations.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedLocations.map(id => {
              const location = locations.find(l => l.id === id);
              return (
                <Badge 
                  key={id}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {location?.name || "Unidade"}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleLocationToggle(id)}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
