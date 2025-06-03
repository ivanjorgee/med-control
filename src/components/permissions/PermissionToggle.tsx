
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PermissionToggleProps {
  id: string;
  defaultChecked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

const PermissionToggle: React.FC<PermissionToggleProps> = ({
  id,
  defaultChecked,
  onToggle,
  disabled = false,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked);

  // Atualizar o estado quando defaultChecked mudar
  useEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  const handleChange = (checked: boolean) => {
    console.log(`=== TOGGLE PERMISSÃO (${id}) ===`);
    console.log("Valor anterior:", isChecked);
    console.log("Novo valor:", checked);
    console.log("Disabled:", disabled);
    
    if (!disabled) {
      setIsChecked(checked);
      onToggle(checked);
    }
  };

  return (
    <div className="flex items-center justify-between w-24">
      <Label htmlFor={id} className={`text-sm font-medium ${isChecked ? 'text-green-600' : 'text-red-600'}`}>
        {isChecked ? "Sim" : "Não"}
      </Label>
      <Switch
        id={id}
        checked={isChecked}
        onCheckedChange={handleChange}
        disabled={disabled}
      />
    </div>
  );
};

export default PermissionToggle;
