
import { Badge } from "@/components/ui/badge";

interface UrgencyBadgeProps {
  urgency: string;
}

export const UrgencyBadge = ({ urgency }: UrgencyBadgeProps) => {
  const getUrgencyBadgeVariant = (urgency: string) => {
    switch (urgency) {
      case 'baixa': return 'secondary';
      case 'normal': return 'outline';
      case 'alta': return 'warning';
      case 'urgente': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Badge variant={getUrgencyBadgeVariant(urgency) as any}>
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </Badge>
  );
};
