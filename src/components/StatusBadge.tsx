
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "available":
        return { label: "Disponível", variant: "outline-success" };
      case "low":
        return { label: "Baixo Estoque", variant: "outline-warning" };
      case "critical":
        return { label: "Crítico", variant: "outline-destructive" };
      case "expired":
        return { label: "Vencido", variant: "destructive" };
      case "pending":
        return { label: "Pendente", variant: "outline-warning" };
      case "approved":
        return { label: "Aprovado", variant: "outline-success" };
      case "delivered":
        return { label: "Entregue", variant: "success" };
      case "cancelled":
        return { label: "Cancelado", variant: "destructive" };
      default:
        return { label: status, variant: "outline" };
    }
  };

  const { label, variant } = getStatusConfig();

  return (
    <Badge 
      className={cn(
        variant === "outline-success" && "border-success text-success hover:bg-success/10 hover:text-success",
        variant === "outline-warning" && "border-warning text-warning hover:bg-warning/10 hover:text-warning",
        variant === "outline-destructive" && "border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive",
        variant === "success" && "bg-success text-success-foreground hover:bg-success/80",
        variant === "warning" && "bg-warning text-warning-foreground hover:bg-warning/80",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        className
      )}
      variant={variant.startsWith("outline") ? "outline" : "default"}
    >
      {label}
    </Badge>
  );
}
