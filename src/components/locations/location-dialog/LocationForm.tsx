import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Location, LocationType, User } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { LocationTypeSelect } from "./LocationTypeSelect";
import { AddressFields } from "./AddressFields";
import { CoordinatorSelect } from "./CoordinatorSelect";
import { ContactInfoFields } from "./ContactInfoFields";
import { StatusToggle } from "./StatusToggle";

interface LocationFormProps {
  location?: Location;
  isEditing: boolean;
  onLocationSaved: (location: Location) => void;
  onCancel: () => void;
}

export function LocationForm({ location, isEditing, onLocationSaved, onCancel }: LocationFormProps) {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "health_unit" as LocationType,
    address: "",
    city: "",
    state: "",
    cnes: "",
    phone: "",
    email: "",
    coordinator: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (location && isEditing) {
      setFormData({
        name: location.name,
        type: location.type,
        address: location.address,
        city: location.city,
        state: location.state,
        cnes: location.cnes || "",
        phone: location.phone,
        email: location.email,
        coordinator: location.coordinator,
        status: location.status,
      });
    }

    // Carregar usuários do localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, [location, isEditing]);

  const handleChange = (field: string, value: string | boolean) => {
    if (field === "coordinator") {
      // Quando o coordenador for selecionado, buscar seus dados
      const selectedUser = users.find(user => user.name === value);
      if (selectedUser) {
        // Preencher automaticamente o telefone e o email do usuário selecionado
        setFormData(prev => ({ 
          ...prev, 
          coordinator: value as string,
          // Se o usuário tiver telefone, usar ele, senão manter o valor atual
          phone: selectedUser.phone || prev.phone,
          // Se o usuário tiver email, usar ele, senão manter o valor atual
          email: selectedUser.email || prev.email
        }));
      } else {
        // Se não encontrar o usuário, apenas atualizar o coordenador
        setFormData(prev => ({ ...prev, coordinator: value as string }));
      }
    } else {
      // Para outros campos, apenas atualizar o valor normalmente
      setFormData(prev => ({ 
        ...prev, 
        [field]: value 
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica (CNES, obrigatório 7 dígitos numéricos)
    if (!formData.name || !formData.city || !formData.state || !formData.cnes || !/^\d{7}$/.test(formData.cnes)) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios corretamente (incluindo CNES com 7 dígitos numéricos).",
      });
      return;
    }
    
    // Criar ou atualizar a unidade
    const savedLocation: Location = {
      id: isEditing && location ? location.id : "",
      name: formData.name,
      type: formData.type,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      cnes: formData.cnes,
      phone: formData.phone,
      email: formData.email,
      coordinator: formData.coordinator,
      createdAt: isEditing && location ? location.createdAt : new Date().toISOString(),
      status: formData.status,
    };
    
    // Enviar para o componente pai
    onLocationSaved(savedLocation);
  };

  // Filtrar apenas usuários ativos para o seletor de coordenadores
  const activeUsers = users.filter(user => user.status === "active");

  const locationTypeLabels: Record<LocationType, string> = {
    hospital: "Hospital",
    clinic: "Clínica",
    pharmacy: "Farmácia",
    health_unit: "Unidade de Saúde",
    other: "Outro"
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <Label htmlFor="name">Nome da Unidade <span className="text-destructive">*</span></Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required 
          />
        </div>
        
        <LocationTypeSelect 
          value={formData.type}
          onChange={(value) => handleChange("type", value)}
          locationTypeLabels={locationTypeLabels}
        />

        <AddressFields
          address={formData.address}
          city={formData.city}
          state={formData.state}
          cnes={formData.cnes}
          onChange={handleChange}
        />
        
        <CoordinatorSelect 
          value={formData.coordinator}
          onChange={(value) => handleChange("coordinator", value)}
          activeUsers={activeUsers}
        />
        
        <ContactInfoFields 
          phone={formData.phone}
          email={formData.email}
          onChange={handleChange}
          readOnly={!!formData.coordinator}
        />
        
        <StatusToggle 
          status={formData.status}
          onChange={(checked) => handleChange("status", checked ? "active" : "inactive")}
        />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{isEditing ? "Salvar Alterações" : "Criar Unidade"}</Button>
      </DialogFooter>
    </form>
  );
}
