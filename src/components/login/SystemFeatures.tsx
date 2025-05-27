
import { Shield, CheckCircle, Key } from "lucide-react";

export function SystemFeatures() {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium border-b border-white/20 pb-2">Recursos do Sistema</h3>
      
      <div className="grid gap-4">
        <FeatureItem 
          icon={Shield}
          title="Controle de Estoque"
          description="Monitore níveis de estoque e receba alertas automáticos"
        />
        
        <FeatureItem
          icon={CheckCircle}
          title="Rastreamento de Distribuição"
          description="Acompanhe a distribuição dos medicamentos em tempo real"
        />
        
        <FeatureItem
          icon={Key}
          title="Multilocal"
          description="Gerencie medicamentos em múltiplas unidades de saúde"
        />
      </div>
    </div>
  );
}

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
  return (
    <div className="flex gap-3">
      <div className="bg-white/20 p-2 rounded-lg">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
}
