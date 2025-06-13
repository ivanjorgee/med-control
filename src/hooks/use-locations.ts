
import { useState, useEffect } from "react";
import { Location } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setIsLoading(true);
      console.log("Carregando unidades do Supabase...");
      
      const { data: supabaseLocations, error } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao carregar do Supabase:", error);
        // Se houver erro, limpar localStorage e usar dados vazios
        localStorage.removeItem(STORAGE_KEY);
        setLocations([]);
        return;
      }

      console.log("Unidades carregadas do Supabase:", supabaseLocations);
      
      // Mapear dados do Supabase para o formato Location
      const mappedLocations: Location[] = (supabaseLocations || []).map(loc => ({
        id: loc.id,
        name: loc.name,
        type: loc.type as Location['type'],
        address: loc.address || "",
        city: loc.city || "",
        state: loc.state || "",
        phone: loc.phone || "",
        email: loc.email || "",
        coordinator: loc.coordinator || "",
        createdAt: loc.created_at || new Date().toISOString(),
        status: loc.status as Location['status']
      }));
      
      setLocations(mappedLocations);
      // Sincronizar com localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mappedLocations));
      
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      // Em caso de erro, limpar localStorage
      localStorage.removeItem(STORAGE_KEY);
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (locationId: string) => {
    try {
      console.log("Excluindo unidade:", locationId);
      
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', locationId);

      if (error) {
        console.error("Erro ao deletar do Supabase:", error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir unidade",
          description: "Ocorreu um erro ao tentar excluir a unidade do banco de dados.",
        });
        return;
      }

      const updatedLocations = locations.filter(loc => loc.id !== locationId);
      setLocations(updatedLocations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      
      console.log("Unidade excluída com sucesso do Supabase");
      toast({
        title: "Unidade excluída",
        description: "A unidade foi removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir unidade:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir unidade",
        description: "Ocorreu um erro ao tentar excluir a unidade.",
      });
    }
  };
  
  const handleLocationSaved = async (savedLocation: Location) => {
    try {
      const isNew = !locations.some(loc => loc.id === savedLocation.id);
      console.log("Salvando unidade:", savedLocation, "É nova:", isNew);
      
      // Garantir que temos um ID válido
      if (!savedLocation.id) {
        savedLocation.id = uuidv4();
      }
      
      let supabaseLocation;
      
      if (isNew) {
        console.log("Inserindo nova unidade no Supabase:", savedLocation);
        
        const { data, error } = await supabase
          .from('locations')
          .insert([{
            id: savedLocation.id,
            name: savedLocation.name,
            type: savedLocation.type,
            address: savedLocation.address,
            city: savedLocation.city,
            state: savedLocation.state,
            phone: savedLocation.phone,
            email: savedLocation.email,
            coordinator: savedLocation.coordinator,
            status: savedLocation.status,
            created_at: savedLocation.createdAt || new Date().toISOString()
          }])
          .select()
          .single();

        if (error) {
          console.error("Erro ao inserir no Supabase:", error);
          throw error;
        }

        console.log("Unidade inserida no Supabase:", data);
        supabaseLocation = {
          id: data.id,
          name: data.name,
          type: data.type as Location['type'],
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          phone: data.phone || "",
          email: data.email || "",
          coordinator: data.coordinator || "",
          createdAt: data.created_at || new Date().toISOString(),
          status: data.status as Location['status']
        };
      } else {
        console.log("Atualizando unidade no Supabase:", savedLocation);
        
        const { data, error } = await supabase
          .from('locations')
          .update({
            name: savedLocation.name,
            type: savedLocation.type,
            address: savedLocation.address,
            city: savedLocation.city,
            state: savedLocation.state,
            phone: savedLocation.phone,
            email: savedLocation.email,
            coordinator: savedLocation.coordinator,
            status: savedLocation.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', savedLocation.id)
          .select()
          .single();

        if (error) {
          console.error("Erro ao atualizar no Supabase:", error);
          throw error;
        }

        console.log("Unidade atualizada no Supabase:", data);
        supabaseLocation = {
          id: data.id,
          name: data.name,
          type: data.type as Location['type'],
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          phone: data.phone || "",
          email: data.email || "",
          coordinator: data.coordinator || "",
          createdAt: data.created_at || savedLocation.createdAt,
          status: data.status as Location['status']
        };
      }

      let updatedLocations: Location[];
      if (isNew) {
        updatedLocations = [...locations, supabaseLocation];
      } else {
        updatedLocations = locations.map(loc => 
          loc.id === savedLocation.id ? supabaseLocation : loc
        );
      }
      
      setLocations(updatedLocations);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      
      console.log("Unidade salva com sucesso!");
      toast({
        title: isNew ? "Unidade criada" : "Unidade atualizada",
        description: `${savedLocation.name} foi ${isNew ? "adicionada" : "atualizada"} com sucesso.`
      });
      
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      
      toast({
        variant: "destructive",
        title: "Erro ao salvar unidade",
        description: "Ocorreu um erro ao tentar salvar a unidade no banco de dados."
      });
    }
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
