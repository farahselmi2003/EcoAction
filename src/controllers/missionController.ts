import type { Mission } from "../models/Mission";
import { api } from "../services/api";
import type { Registration } from "../types/api.types"; 

export async function fetchMissions(): Promise<Mission[]> {
  return api.get<Mission[]>("/missions");
}

export async function fetchMission(id: string): Promise<Mission> {
  return api.get<Mission>(`/missions/${id}`);
}

export async function fetchRegistrations(): Promise<Registration[]> {
  return api.get<Registration[]>("/registrations");
}

export async function registerMission(userId: string, missionId: string) {
  return api.post<Registration>("/registrations", { userId, missionId });
}

export async function unregisterMission(registrationId: string) {
  return api.delete<void>(`/registrations/${registrationId}`);
}
