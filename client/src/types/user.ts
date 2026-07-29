export type Role = "DRIVER" | "OWNER" | "ADMIN";

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: Role;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role: "DRIVER" | "OWNER";
  businessName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
