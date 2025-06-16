
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AdminDataSection } from "./first-access/AdminDataSection";
import { HealthUnitSection } from "./first-access/HealthUnitSection";
import { FormData, useFormValidation } from "./first-access/FormValidation";
import { useFormSubmission } from "./first-access/FormSubmission";

export function FirstAccessForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    locationName: "",
    locationAddress: "",
    locationCity: "",
    locationPhone: "",
    locationCnes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { validateForm } = useFormValidation();
  const { submitForm } = useFormSubmission();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validação e máscara para CNES (7 dígitos)
  const handleCnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite só números, limita a 7 chars
    let value = e.target.value.replace(/\D/g, '').slice(0, 7);
    setFormData(prev => ({ ...prev, locationCnes: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!validateForm(formData)) {
        setIsLoading(false);
        return;
      }

      await submitForm(formData);
      
    } catch (error) {
      console.error("❌ Erro durante a configuração inicial:", error);
      toast({
        variant: "destructive",
        title: "Erro na configuração",
        description: "Ocorreu um erro ao configurar o sistema."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-primary flex items-center justify-center gap-2">
          <UserPlus className="h-6 w-6" />
          Configuração Inicial do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-700">
            <strong>Primeiro acesso:</strong> Configure o administrador inicial e a primeira unidade de saúde do sistema.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AdminDataSection 
            formData={formData} 
            onFieldChange={handleChange} 
          />

          <HealthUnitSection 
            formData={formData} 
            onFieldChange={handleChange}
            onCnesChange={handleCnesChange}
          />

          <Button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 mt-6" 
            disabled={isLoading}
          >
            {isLoading ? "Configurando..." : (
              <>
                <UserPlus className="h-4 w-4" />
                Configurar Sistema
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
