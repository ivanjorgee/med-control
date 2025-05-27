
import { User } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "Admin do Sistema",
    email: "admin@medcontrol.com",
    password: "admin123", // Em produção seria um hash
    role: "admin",
    locationId: "loc-001", // Administrador geral associado à unidade central
    healthUnit: "Unidade Central",
    canApprove: true,
    createdAt: "2024-01-01T08:00:00",
    status: "active"
  },
  {
    id: "user-002",
    name: "João Silva",
    email: "joao@medcontrol.com",
    password: "joao123",
    role: "pharmacist",
    locationId: "loc-001", // Farmacêutico da unidade central
    healthUnit: "Unidade Central",
    canApprove: true,
    createdAt: "2024-01-05T10:30:00",
    status: "active"
  },
  {
    id: "user-003",
    name: "Maria Santos",
    email: "maria@medcontrol.com",
    password: "maria123",
    role: "user",
    locationId: "loc-002", // Responsável pelo posto de saúde
    healthUnit: "Posto de Saúde Vila Mariana",
    canApprove: false,
    createdAt: "2024-01-10T14:15:00",
    status: "active"
  },
  {
    id: "user-004",
    name: "Carlos Ferreira",
    email: "carlos@medcontrol.com",
    password: "carlos123",
    role: "distributor",
    locationId: "loc-003", // Distribuidor da farmácia popular
    healthUnit: "Farmácia Popular - Centro",
    canApprove: true,
    createdAt: "2024-01-15T09:45:00",
    status: "active"
  },
  {
    id: "user-005",
    name: "Ana Oliveira",
    email: "ana@medcontrol.com",
    password: "ana123",
    role: "health_unit",
    locationId: "loc-004", // Funcionário da clínica especializada
    healthUnit: "Clínica Especializada Moema",
    canApprove: false,
    createdAt: "2024-01-20T11:20:00",
    status: "inactive"
  }
];
