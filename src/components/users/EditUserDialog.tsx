
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
import { Edit } from "lucide-react";
import { User, UserRole, Location } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EditUserDialogProps {
  user: User;
  onUserUpdated: (updatedUser: User) => void;
}

export function EditUserDialog({ user, onUserUpdated }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<User, 'id' | 'createdAt'>>({
    name: user.name,
    email: user.email,
    password: user.password,
    healthUnit: user.healthUnit,
    role: user.role,
    canApprove: user.canApprove,
    status: user.status,
    locationId: user.locationId,
    phone: user.phone || '',
  });

  // Update form data if the user prop changes
  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      password: user.password,
      healthUnit: user.healthUnit,
      role: user.role,
      canApprove: user.canApprove,
      status: user.status,
      locationId: user.locationId,
      phone: user.phone || '',
    });
  }, [user]);

  // Load locations when dialog opens
  useEffect(() => {
    if (open) {
      const storedLocations = localStorage.getItem("medcontrol_locations");
      if (storedLocations) {
        setLocations(JSON.parse(storedLocations));
      }
    }
  }, [open]);

  const handleChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create an updated user object
    const updatedUser: User = {
      ...user,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      healthUnit: formData.healthUnit, // Keep this to avoid breaking existing code
      role: formData.role as UserRole,
      canApprove: formData.canApprove,
      status: formData.status as 'active' | 'inactive',
      locationId: formData.locationId,
      phone: formData.phone,
    };
    
    // Pass the updated user to the parent component
    onUserUpdated(updatedUser);
    
    // Show a success toast
    toast({
      title: "Usuário atualizado com sucesso",
      description: `${formData.name} foi atualizado.`,
    });
    
    // Close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Altere as informações do usuário conforme necessário.
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
                value={formData.phone || ""}
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
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange("status", value as 'active' | 'inactive')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
