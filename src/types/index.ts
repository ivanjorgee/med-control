
export interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  measureUnit: string;
  batchNumber: string;
  expirationDate: string;
  manufacturer: string;
  quantity: number;
  minQuantity: number;
  status: MedicineStatus;
  locationId: string; // ID do local onde o medicamento está
}

export type MedicineStatus = 'available' | 'low' | 'critical' | 'expired';

export interface DistributionRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  batchNumber: string;
  quantity: number;
  sourceLocation: string;
  destinationLocation: string;
  requestedBy: string;
  approvedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'delivered' | 'cancelled';
  locationId: string; // ID do local responsável
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em um sistema real, isso seria hash/salt
  role: UserRole;
  avatar?: string;
  healthUnit: string;
  locationId: string; // ID do local ao qual está associado
  canApprove: boolean;
  createdAt: string;
  status: 'active' | 'inactive';
  phone?: string; // Campo de telefone do usuário
}

export type UserRole = 'admin' | 'user' | 'pharmacist' | 'distributor' | 'health_unit';

export interface HealthUnit {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  coordinator: string;
}

export interface Location {
  id: string;
  name: string;
  type: LocationType;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  coordinator: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export type LocationType = 'hospital' | 'clinic' | 'pharmacy' | 'health_unit' | 'other';

// Interface para os dados do usuário autenticado
export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationId: string;
  locationName: string;
}
