
import { Location } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const mockLocations: Location[] = [
  {
    id: "loc-001",
    name: "Unidade Central - São Paulo",
    type: "hospital",
    address: "Av. Paulista, 1500",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3333-4444",
    email: "central@medcontrol.com",
    coordinator: "Dr. Carlos Silva",
    createdAt: "2024-01-15T10:00:00",
    status: "active"
  },
  {
    id: "loc-002",
    name: "Posto de Saúde Vila Mariana",
    type: "health_unit",
    address: "Rua Domingos de Morais, 350",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3333-5555",
    email: "vilamariana@medcontrol.com",
    coordinator: "Dra. Ana Ferreira",
    createdAt: "2024-02-10T14:30:00",
    status: "active"
  },
  {
    id: "loc-003",
    name: "Farmácia Popular - Centro",
    type: "pharmacy",
    address: "Rua Direita, 250",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3333-6666",
    email: "farmacia.centro@medcontrol.com",
    coordinator: "Farm. Rafael Mendes",
    createdAt: "2024-03-05T09:15:00",
    status: "active"
  },
  {
    id: "loc-004",
    name: "Clínica Especializada Moema",
    type: "clinic",
    address: "Av. Ibirapuera, 2000",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3333-7777",
    email: "clinica.moema@medcontrol.com",
    coordinator: "Dr. Roberto Almeida",
    createdAt: "2024-02-25T11:45:00",
    status: "inactive"
  }
];
