
import { Input } from "@/components/ui/input";
import { Building } from "lucide-react";
import { FormData } from "./FormValidation";

interface HealthUnitSectionProps {
  formData: FormData;
  onFieldChange: (field: string, value: string) => void;
  onCnesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function HealthUnitSection({ formData, onFieldChange, onCnesChange }: HealthUnitSectionProps) {
  return (
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
          onChange={(e) => onFieldChange("locationName", e.target.value)}
          className="border-gray-300 focus:ring-primary focus:border-primary"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="locationCnes" className="text-sm font-medium text-gray-700">
          CNES *
        </label>
        <Input
          id="locationCnes"
          type="text"
          placeholder="Somente números (7 dígitos)"
          value={formData.locationCnes}
          onChange={onCnesChange}
          className="border-gray-300 focus:ring-primary focus:border-primary"
          required
          pattern="\d{7}"
          maxLength={7}
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
          onChange={(e) => onFieldChange("locationAddress", e.target.value)}
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
            onChange={(e) => onFieldChange("locationCity", e.target.value)}
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
            onChange={(e) => onFieldChange("locationPhone", e.target.value)}
            className="border-gray-300 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
