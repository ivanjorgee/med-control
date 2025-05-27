
import { UserRole } from "@/types";

export type AuthContextType = {
  isAuthenticated: boolean;
  authUser: AuthUserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isPharmacist: boolean;
  canApproveDistribution: boolean;
};

export interface AuthUserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  locationId: string;
  locationName: string;
}

export interface DefaultUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  locationId: string;
  status: string;
}

export interface DefaultLocation {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  coordinator: string;
  createdAt: string;
  status: string;
  coordinatorId: string;
}
