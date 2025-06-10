
import { useState } from "react";

export function SystemMessages() {
  const [systemMessages] = useState([
    {
      id: 1,
      title: "Sistema atualizado",
      description: "Novas funcionalidades disponíveis na versão 2.5",
      date: "15/05/2025"
    },
    {
      id: 2,
      title: "Manutenção preventiva",
      description: "O sistema ficará indisponível dia 30/06 das 22h às 23h",
      date: "18/05/2025"
    }
  ]);

  return (
    <div className="space-y-3">
      {systemMessages.map((message) => (
        <div key={message.id} className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{message.title}</h4>
            <span className="text-xs opacity-80">{message.date}</span>
          </div>
          <p className="text-sm opacity-90 mt-1">{message.description}</p>
        </div>
      ))}
    </div>
  );
}
