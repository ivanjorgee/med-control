
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Info, ShieldCheck } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface PermissionTypeCardProps {
  title: string;
  description: string;
  note: string;
  icon: "primary" | "secondary" | "accent";
  detailedInfo?: string;
}

const PermissionTypeCard: React.FC<PermissionTypeCardProps> = ({
  title,
  description,
  note,
  icon,
  detailedInfo = "Este tipo de permissão concede acesso especial às funcionalidades do sistema. Passe o mouse para saber mais."
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card className={`bg-${icon}/5 border-${icon}/20 hover:shadow-md transition-shadow cursor-help`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className={`h-5 w-5 mr-2 text-${icon}`} />
              {title}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className={`h-4 w-4 ml-2 text-${icon} cursor-help`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Passe o mouse sobre o cartão para mais detalhes</p>
                </TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className={`mt-2 p-2 bg-${icon}/10 rounded-md`}>
              <p className="text-xs flex items-center">
                <Info className={`h-3 w-3 mr-1 text-${icon}`} />
                {note}
              </p>
            </div>
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="p-4 w-80">
        <div className="space-y-2">
          <h4 className={`text-${icon} font-medium`}>{title} - Detalhes Completos</h4>
          <p className="text-sm">{detailedInfo}</p>
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Esta permissão deve ser concedida apenas a usuários que precisam desta funcionalidade específica.
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default PermissionTypeCard;
