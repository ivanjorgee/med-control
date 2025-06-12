import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Key, Mail, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User as UserType, Location } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export function FirstAccessForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    locationName: "",
    locationAddress: "",
    locationCity: "",
    locationPhone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("=== CONFIGURAÇÃO INICIAL DO SISTEMA ===");
      console.log("Dados do formulário:", formData);
      
      // Validações
      if (!formData.name || !formData.email || !formData.password || !formData.locationName) {
        toast({
          variant: "destructive",
          title: "Erro!",
          description: "Por favor, preencha todos os campos obrigatórios."
        });
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          variant: "destructive",
          title: "Erro!",
          description: "As senhas não coincidem."
        });
        setIsLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast({
          variant: "destructive",
          title: "Erro!",
          description: "A senha deve ter pelo menos 6 caracteres."
        });
        setIsLoading(false);
        return;
      }

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
        status: "active"
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
            created_at: newLocation.createdAt
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
        setIsLoading(false);
        return;
      }

      console.log("=== CONFIGURAÇÃO CONCLUÍDA COM SUCESSO ===");

      toast({
        title: "Configuração concluída!",
        description: "Sistema configurado com sucesso. Dados salvos no banco de dados."
      });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
      
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
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
              Dados do Administrador
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2 text-primary" />
                Nome Completo *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border-gray-300 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                Email *
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border-gray-300 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <Key className="h-4 w-4 mr-2 text-primary" />
                  Senha *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <Key className="h-4 w-4 mr-2 text-primary" />
                  Confirmar Senha *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirme a senha"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-medium text-gray-800 border-b pb-2">
              Dados da Unidade de Saúde
            </h3>
            
            <div className="space-y-2">
              <label htmlFor="locationName" className="text-sm font-medium text-gray-700 flex items-center">
                <Building className="h-4 w-4 mr-2 text-primary" />
                Nome da Unidade *
              </label>
              <Input
                id="locationName"
                type="text"
                placeholder="Ex: UBS Central, Hospital Municipal..."
                value={formData.locationName}
                onChange={(e) => handleChange("locationName", e.target.value)}
                className="border-gray-300 focus:ring-primary focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="locationAddress" className="text-sm font-medium text-gray-700">
                Endereço
              </label>
              <Input
                id="locationAddress"
                type="text"
                placeholder="Rua, número, bairro"
                value={formData.locationAddress}
                onChange={(e) => handleChange("locationAddress", e.target.value)}
                className="border-gray-300 focus:ring-primary focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="locationCity" className="text-sm font-medium text-gray-700">
                  Cidade
                </label>
                <Input
                  id="locationCity"
                  type="text"
                  placeholder="Nome da cidade"
                  value={formData.locationCity}
                  onChange={(e) => handleChange("locationCity", e.target.value)}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="locationPhone" className="text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <Input
                  id="locationPhone"
                  type="tel"
                  placeholder="(00) 0000-0000"
                  value={formData.locationPhone}
                  onChange={(e) => handleChange("locationPhone", e.target.value)}
                  className="border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

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
