
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
        // Fallback para localStorage se Supabase falhar
        await loadFromLocalStorage();
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
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
      // Fallback para localStorage em caso de erro
      await loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromLocalStorage = async () => {
    try {
      const storedLocations = localStorage.getItem(STORAGE_KEY);
      
      if (storedLocations) {
        const parsedLocations = JSON.parse(storedLocations);
        console.log("Carregando do localStorage como fallback:", parsedLocations);
        
        const validLocations = parsedLocations.filter((loc: any) => {
          if (!loc.id || !loc.name) {
            console.warn("Localização inválida encontrada:", loc);
            return false;
          }
          
          if (!loc.createdAt || loc.createdAt === 'undefined' || loc.createdAt === 'null') {
            console.log("Corrigindo createdAt para localização:", loc.name);
            loc.createdAt = new Date().toISOString();
          }
          
          return true;
        });
        
        setLocations(validLocations);
      } else {
        setLocations([]);
      }
    } catch (error) {
      console.error("Erro ao carregar do localStorage:", error);
      setLocations([]);
    }
  };

  const handleDelete = async (locationId: string) => {
    try {
      console.log("Excluindo unidade:", locationId);
      
      // Tentar deletar do Supabase primeiro
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

      // Atualizar estado local
      const updatedLocations = locations.filter(loc => loc.id !== locationId);
      setLocations(updatedLocations);
      
      // Também remover do localStorage como backup
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
      
      let supabaseLocation;
      
      if (isNew) {
        // Criar nova unidade no Supabase
        const newLocation = {
          ...savedLocation,
          id: savedLocation.id || uuidv4(),
          created_at: savedLocation.createdAt || new Date().toISOString()
        };
        
        console.log("Inserindo nova unidade no Supabase:", newLocation);
        
        const { data, error } = await supabase
          .from('locations')
          .insert([{
            id: newLocation.id,
            name: newLocation.name,
            type: newLocation.type,
            address: newLocation.address,
            city: newLocation.city,
            state: newLocation.state,
            phone: newLocation.phone,
            email: newLocation.email,
            coordinator: newLocation.coordinator,
            status: newLocation.status,
            created_at: newLocation.createdAt
          }])
          .select()
          .single();

        if (error) {
          console.error("Erro ao inserir no Supabase:", error);
          throw error;
        }

        console.log("Unidade inserida no Supabase:", data);
        
        // Mapear resposta do Supabase para formato Location
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
        // Atualizar unidade existente no Supabase
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
        
        // Mapear resposta do Supabase para formato Location
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

      // Atualizar estado local
      let updatedLocations: Location[];
      if (isNew) {
        updatedLocations = [...locations, supabaseLocation];
      } else {
        updatedLocations = locations.map(loc => 
          loc.id === savedLocation.id ? supabaseLocation : loc
        );
      }
      
      setLocations(updatedLocations);
      
      // Também salvar no localStorage como backup
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
      
      console.log("Unidade salva com sucesso!");
      toast({
        title: isNew ? "Unidade criada" : "Unidade atualizada",
        description: `${savedLocation.name} foi ${isNew ? "adicionada" : "atualizada"} com sucesso no banco de dados.`
      });
      
    } catch (error) {
      console.error("Erro ao salvar unidade:", error);
      
      // Em caso de erro, tentar salvar no localStorage como fallback
      const isNew = !locations.some(loc => loc.id === savedLocation.id);
      let updatedLocations: Location[];
      
      if (isNew) {
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
        variant: "destructive",
        title: "Erro no banco de dados",
        description: `Não foi possível salvar no banco. Dados salvos localmente como backup.`
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
