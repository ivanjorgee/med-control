
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface StatusToggleProps {
  status: "active" | "inactive";
  onChange: (checked: boolean) => void;
  label?: string;
}

export function StatusToggle({ status, onChange, label = "Unidade ativa" }: StatusToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="status" 
        checked={status === "active"}
        onCheckedChange={onChange}
      />
      <Label htmlFor="status">{label}</Label>
    </div>
  );
}
