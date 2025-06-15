

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddressFieldsProps {
  address: string;
  city: string;
  state: string;
  cnes: string;
  onChange: (field: string, value: string) => void;
}

export function AddressFields({ address, city, state, cnes, onChange }: AddressFieldsProps) {
  // Validação e máscara para CNES (7 dígitos)
  const handleCnesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite só números, limita a 7 chars
    let value = e.target.value.replace(/\D/g, '').slice(0, 7);
    onChange("cnes", value);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2">
        <Label htmlFor="address">Endereço</Label>
        <Input 
          id="address" 
          value={address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="gap-2">
          <Label htmlFor="city">Cidade <span className="text-destructive">*</span></Label>
          <Input 
            id="city" 
            value={city}
            onChange={(e) => onChange("city", e.target.value)}
            required 
          />
        </div>
        <div className="gap-2">
          <Label htmlFor="state">UF <span className="text-destructive">*</span></Label>
          <Input 
            id="state" 
            value={state}
            onChange={(e) => onChange("state", e.target.value)}
            required 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-2">
        <Label htmlFor="cnes">CNES <span className="text-destructive">*</span></Label>
        <Input
          id="cnes"
          value={cnes}
          onChange={handleCnesChange}
          required
          pattern="\d{7}"
          maxLength={7}
          placeholder="Somente números (7 dígitos)"
        />
      </div>
    </>
  );
}

