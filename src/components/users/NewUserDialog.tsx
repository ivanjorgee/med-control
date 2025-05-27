
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { User, UserRole, Location } from "@/types";
import { useToast } from "@/hooks/use-toast";

type NewUserFormData = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  canApprove: boolean;
  phone: string;
  locationId: string;
}

interface NewUserDialogProps {
  onUserCreated: (user: User) => void;
}

export function NewUserDialog({ onUserCreated }: NewUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewUserFormData>({
    name: "",
    email: "",
    password: "",
    role: "admin",
    canApprove: false,
    phone: "",
    locationId: "",
  });

  // Load locations when dialog opens
  useEffect(() => {
    if (open) {
      const storedLocations = localStorage.getItem("medcontrol_locations");
      if (storedLocations) {
        const locationsList = JSON.parse(storedLocations);
        setLocations(locationsList);
        // Set default location if available
        if (locationsList.length > 0 && !formData.locationId) {
          setFormData(prev => ({ ...prev, locationId: locationsList[0].id }));
        }
      }
    }
  }, [open]);

  const handleChange = (field: keyof NewUserFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new user with the form data
    const newUser: User = {
      id: `user-${Date.now()}`, // Generate a simple ID based on timestamp
      name: formData.name,
      email: formData.email,
      password: formData.password,
      healthUnit: "", // Keeping this for backward compatibility
      role: formData.role,
      canApprove: formData.canApprove,
      locationId: formData.locationId, // Save the selected location ID
      createdAt: new Date().toISOString(),
      status: "active",
      phone: formData.phone, // Add the phone number to the user data
    };
    
    // Pass the new user to the parent component
    onUserCreated(newUser);
    
    // Show a success toast
    toast({
      title: "Usuário criado com sucesso",
      description: `${formData.name} foi adicionado ao sistema.`,
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "admin",
      canApprove: false,
      phone: "",
      locationId: "",
    });
    
    // Close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Usuário</DialogTitle>
          <DialogDescription>
            Preencha as informações abaixo para criar um novo usuário no sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required 
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required 
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required 
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="location">Unidade</Label>
              <Select 
                value={formData.locationId} 
                onValueChange={(value) => handleChange("locationId", value)}
                required
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="role">Função</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => handleChange("role", value as UserRole)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administração</SelectItem>
                  <SelectItem value="pharmacist">Farmácia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="canApprove" 
                checked={formData.canApprove}
                onCheckedChange={(checked) => handleChange("canApprove", checked)}
              />
              <Label htmlFor="canApprove">Permissão para aprovação</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
