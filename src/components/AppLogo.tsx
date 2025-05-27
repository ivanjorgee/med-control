
import { Pill } from "lucide-react";

export function AppLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary p-1.5 rounded-lg text-white">
        <Pill className="h-5 w-5" />
      </div>
      <span className="font-bold text-xl text-primary">MedControl</span>
    </div>
  );
}
