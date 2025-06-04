
import React from "react";

interface PermissionsHeaderProps {}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Controle de Permissões</h1>
        <p className="text-muted-foreground">
          Gerencie quem pode aprovar e liberar medicamentos.
        </p>
      </div>
    </div>
  );
};

export default PermissionsHeader;
