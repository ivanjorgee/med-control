
import { useState, useEffect } from "react";
import { Location } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "medcontrol_locations";

export const useLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const { toast } = useToast();

  useEffect(() => {
    // Loading locations from localStorage
    const loadLocations = async () => {
      try {
        setIsLoading(true);
        const storedLocations = localStorage.getItem(STORAGE_KEY);
        
        if (storedLocations) {
          try {
            const parsedLocations = JSON.parse(storedLocations);
            console.log("Localizações carregadas do localStorage:", parsedLocations);
            
            // Validar e limpar dados se necessário
            const validLocations = parsedLocations.filter((loc: any) => {
              if (!loc.id || !loc.name) {
                console.warn("Localização inválida encontrada:", loc);
                return false;
              }
              
              // Garantir que createdAt existe e é válido
              if (!loc.createdAt || loc.createdAt === 'undefined' || loc.createdAt === 'null') {
                console.log("Corrigindo createdAt para localização:", loc.name);
                loc.createdAt = new Date().toISOString();
              }
              
              return true;
            });
            
            setLocations(validLocations);
            
            // Se os dados foram corrigidos, salva de volta
            if (validLocations.length !== parsedLocations.length || 
                validLocations.some((loc: any, index: number) => loc.createdAt !== parsedLocations[index]?.createdAt)) {
              console.log("Salvando localizações corrigidas...");
              localStorage.setItem(STORAGE_KEY, JSON.stringify(validLocations));
            }
          } catch (parseError) {
            console.error("Erro ao fazer parse das localizações:", parseError);
            // Se há erro no parse, inicializa com array vazio
            setLocations([]);
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
          }
        } else {
          // Initialize with empty array instead of mock data
          setLocations([]);
          localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        }
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        setLocations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadLocations();
  }, []);

  const handleDelete = async (locationId: string) => {
    try {
      const updatedLocations = locations.filter(loc => loc.id !== locationId);
      setLocations(updatedLocations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      
      toast({
        title: "Unidade excluída",
        description: "A unidade foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir unidade",
        description: "Ocorreu um erro ao tentar excluir a unidade.",
      });
    }
  };
  
  const handleLocationSaved = (savedLocation: Location) => {
    const isNew = !locations.some(loc => loc.id === savedLocation.id);
    let updatedLocations: Location[];
    
    if (isNew) {
      // Generate a new ID if it's a newly created location
      const newLocation = {
        ...savedLocation,
        id: savedLocation.id || `loc-${uuidv4()}`,
        createdAt: savedLocation.createdAt || new Date().toISOString()
      };
      updatedLocations = [...locations, newLocation];
    } else {
      updatedLocations = locations.map(loc => 
        loc.id === savedLocation.id ? savedLocation : loc
      );
    }
    
    setLocations(updatedLocations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
    
    toast({
      title: isNew ? "Unidade criada" : "Unidade atualizada",
      description: `${savedLocation.name} foi ${isNew ? "adicionada" : "atualizada"} com sucesso.`
    });
  };

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = 
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (location.coordinator && location.coordinator.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || location.status === statusFilter;
    const matchesType = typeFilter === "all" || location.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const locationTypeLabels: Record<Location['type'], string> = {
    hospital: "Hospital",
    clinic: "Clínica",
    pharmacy: "Farmácia",
    health_unit: "Unidade de Saúde",
    other: "Outro"
  };

  return {
    locations: filteredLocations,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    handleDelete,
    handleLocationSaved,
    locationTypeLabels,
  };
};
