import type { User } from "../models/User";
import { api } from "../services/api";
export async function fetchUsers(): Promise<User[]> {
  return api.get<User[]>("/users");
}
export async function fetchUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`);
}
