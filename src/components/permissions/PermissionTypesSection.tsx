
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PermissionTypeCard from "./PermissionTypeCard";

const PermissionTypesSection: React.FC = () => {
  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl text-primary">Permissões do Sistema</CardTitle>
        <CardDescription>
          Defina quais usuários têm autorização para liberar medicamentos e aprovar distribuições.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PermissionTypeCard
            title="Aprovador de Distribuição"
            description="Pode aprovar solicitações de distribuição de medicamentos para unidades de saúde."
            note="Esta permissão é geralmente atribuída a administradores e farmacêuticos responsáveis."
            icon="primary"
            detailedInfo="Os aprovadores de distribuição têm a responsabilidade de analisar e aprovar as solicitações de transferência de medicamentos entre unidades. Eles verificam a disponibilidade, prioridade e conformidade com protocolos de distribuição antes de autorizar o envio dos medicamentos."
          />
          
          <PermissionTypeCard
            title="Liberação de Medicamentos"
            description="Pode liberar medicamentos controlados e especiais do estoque."
            note="Esta permissão é necessária para dispensar medicamentos controlados aos pacientes."
            icon="secondary"
            detailedInfo="Usuários com permissão de liberação podem dispensar medicamentos controlados e de uso restrito para pacientes. Eles são responsáveis por garantir que todas as prescrições sejam válidas, registrar corretamente a saída no sistema e orientar os pacientes sobre o uso adequado."
          />
          
          <PermissionTypeCard
            title="Ajuste de Estoque"
            description="Pode realizar ajustes no estoque e registrar entradas e baixas."
            note="Esta permissão permite corrigir discrepâncias no estoque e registrar novas entregas."
            icon="accent"
            detailedInfo="A permissão de ajuste de estoque permite ao usuário fazer correções no inventário, registrar novos lotes recebidos, baixas por perdas ou vencimentos, e realizar inventários físicos. Esta função é essencial para manter a precisão dos dados de estoque no sistema."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionTypesSection;
