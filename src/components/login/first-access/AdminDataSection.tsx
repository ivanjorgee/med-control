
import { Input } from "@/components/ui/input";
import { User, Mail, Key } from "lucide-react";
import { FormData } from "./FormValidation";

interface AdminDataSectionProps {
  formData: FormData;
  onFieldChange: (field: string, value: string) => void;
}

export function AdminDataSection({ formData, onFieldChange }: AdminDataSectionProps) {
  return (
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
          onChange={(e) => onFieldChange("name", e.target.value)}
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
          onChange={(e) => onFieldChange("email", e.target.value)}
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
            onChange={(e) => onFieldChange("password", e.target.value)}
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
            onChange={(e) => onFieldChange("confirmPassword", e.target.value)}
            className="border-gray-300 focus:ring-primary focus:border-primary"
            required
          />
        </div>
      </div>
    </div>
  );
}
