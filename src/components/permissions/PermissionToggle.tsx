
import React, { useState } from "react";
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

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
    onToggle(checked);
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
