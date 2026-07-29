import { apiFetch } from "./client";
import type { AuthResponse, LoginInput, RegisterInput, User } from "../types/user";

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function me(token: string): Promise<{ user: User }> {
  return apiFetch<{ user: User }>("/auth/me", { method: "GET" }, token);
}
