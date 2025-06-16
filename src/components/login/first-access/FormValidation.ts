
import { useToast } from "@/hooks/use-toast";

export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationPhone: string;
  locationCnes: string;
}

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (formData: FormData): boolean => {
    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.locationName || !formData.locationCnes) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, preencha todos os campos obrigatórios."
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "As senhas não coincidem."
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "A senha deve ter pelo menos 6 caracteres."
      });
      return false;
    }

    // Validação do CNES (deve ter exatamente 7 dígitos)
    if (!/^\d{7}$/.test(formData.locationCnes)) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "O CNES deve ter exatamente 7 dígitos numéricos."
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};
