
import { DefaultUser, DefaultLocation } from "./types";
import { UserRole } from "@/types";

export const DEFAULT_USERS: DefaultUser[] = [
  {
    id: "admin-001",
    name: "Administrador do Sistema",
    email: "sms.sjapa@gmail.com",
    password: "smss@2025",
    role: "admin" as UserRole,
    locationId: "loc-001",
    status: "active"
  },
  {
    id: "pharmacist-001", 
    name: "Farmacêutico Responsável",
    email: "ivanjfm15@gmail.com",
    password: "Adbc102030",
    role: "pharmacist" as UserRole,
    locationId: "loc-001",
    status: "active"
  },
  {
    id: "user-001",
    name: "Usuário Teste",
    email: "usuario@medcontrol.com",
    password: "user123",
    role: "user" as UserRole,
    locationId: "loc-001", 
    status: "active"
  }
];

export const DEFAULT_LOCATIONS: DefaultLocation[] = [
  {
    id: "loc-001",
    name: "Unidade Central de Saúde",
    type: "hospital",
    address: "Rua Principal, 123",
    phone: "(11) 99999-9999",
    status: "active",
    coordinatorId: "admin-001"
  }
];
