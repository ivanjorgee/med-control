
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ContactInfoFieldsProps {
  phone: string;
  email: string;
  onChange: (field: string, value: string) => void;
  readOnly: boolean;
}

export function ContactInfoFields({ phone, email, onChange, readOnly }: ContactInfoFieldsProps) {
  // Handle phone input formatting
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove all non-digits
    value = value.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 9) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }
    }
    
    onChange("phone", value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input 
          id="phone" 
          value={phone}
          onChange={handlePhoneChange}
          placeholder="(XX) XXXXX-XXXX"
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
      </div>
      <div className="gap-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email"
          value={email}
          onChange={(e) => onChange("email", e.target.value)}
          readOnly={readOnly}
          className={readOnly ? "bg-gray-100" : ""}
        />
      </div>
    </div>
  );
}
