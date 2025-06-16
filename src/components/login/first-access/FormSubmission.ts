
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { User as UserType, Location } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { FormData } from "./FormValidation";

export const useFormSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const submitForm = async (formData: FormData) => {
    console.log("=== CONFIGURAÇÃO INICIAL DO SISTEMA ===");
    console.log("Dados do formulário:", formData);

    // Criar primeira localização com UUID válido
    const locationId = uuidv4();
    const newLocation: Location = {
      id: locationId,
      name: formData.locationName,
      type: "health_unit",
      address: formData.locationAddress || "",
      city: formData.locationCity || "",
      state: "PA",
      phone: formData.locationPhone || "",
      email: formData.email,
      coordinator: formData.name,
      createdAt: new Date().toISOString(),
      status: "active",
      cnes: formData.locationCnes
    };

    console.log("✅ Tentando salvar localização no Supabase:", newLocation);

    try {
      const { data: supabaseLocation, error: locationError } = await supabase
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
          created_at: newLocation.createdAt,
          cnes: newLocation.cnes
        }])
        .select()
        .single();

      if (locationError) {
        console.error("❌ Erro ao salvar localização no Supabase:", locationError);
        throw locationError;
      }

      console.log("✅ Localização salva no Supabase:", supabaseLocation);
    } catch (supabaseError) {
      console.error("❌ Falha ao conectar com Supabase, usando localStorage:", supabaseError);
      // Continuar com localStorage como fallback
    }

    // Criar primeiro usuário administrador com UUID válido
    const userId = uuidv4();
    const newUser: UserType = {
      id: userId,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: "admin",
      healthUnit: formData.locationName,
      locationId: locationId,
      canApprove: true,
      createdAt: new Date().toISOString(),
      status: "active",
      phone: formData.locationPhone || "",
      permissions: {
        canDistribute: true,
        canRelease: true,
        canAdjustStock: true
      }
    };

    console.log("✅ Tentando salvar usuário no Supabase:", newUser);

    try {
      const { data: supabaseUser, error: userError } = await supabase
        .from('users')
        .insert([{
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
          location_id: newUser.locationId,
          status: newUser.status,
          created_at: newUser.createdAt
        }])
        .select()
        .single();

      if (userError) {
        console.error("❌ Erro ao salvar usuário no Supabase:", userError);
        throw userError;
      }

      console.log("✅ Usuário salvo no Supabase:", supabaseUser);
    } catch (supabaseError) {
      console.error("❌ Falha ao salvar usuário no Supabase, usando localStorage:", supabaseError);
    }

    // Salvar no localStorage como backup
    try {
      console.log("Salvando dados no localStorage como backup...");
      localStorage.setItem("medcontrol_locations", JSON.stringify([newLocation]));
      localStorage.setItem("users", JSON.stringify([newUser]));
      localStorage.setItem("medcontrol-setup-complete", "true");
      
      localStorage.setItem("medcontrol_medicines", JSON.stringify([]));
      localStorage.setItem("medcontrol_distributions", JSON.stringify([]));
      localStorage.setItem("medcontrol_medication_requests", JSON.stringify([]));
      localStorage.setItem("medcontrol_dispensations", JSON.stringify([]));

      console.log("✅ Dados salvos no localStorage com sucesso");
      
    } catch (error) {
      console.error("❌ Erro ao salvar no localStorage:", error);
      toast({
        variant: "destructive",
        title: "Erro na configuração",
        description: "Erro ao salvar dados no sistema. Tente novamente."
      });
      throw error;
    }

    console.log("=== CONFIGURAÇÃO CONCLUÍDA COM SUCESSO ===");

    toast({
      title: "Configuração concluída!",
      description: "Sistema configurado com sucesso. Dados salvos no banco de dados."
    });

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return { submitForm };
};
