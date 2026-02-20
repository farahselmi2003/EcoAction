import { useQuery } from "@tanstack/react-query";
import {
  fetchMissions,
  fetchRegistrations,
} from "../controllers/missionController";
import type { Mission } from "../models/Mission";

export function useMissions(search: string, category?: Mission["category"]) {
  const missionsQuery = useQuery({
    queryKey: ["missions"],
    queryFn: fetchMissions,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
  });

  const registrationsQuery = useQuery({
    queryKey: ["registrations"],
    queryFn: fetchRegistrations,
    staleTime: 1000 * 30,
  });

  const filtered =
    missionsQuery.data?.filter((m) => {
      const s = search.trim().toLowerCase();
      const okText =
        s.length === 0 ||
        m.title.toLowerCase().includes(s) ||
        m.description.toLowerCase().includes(s) ||
        m.location.toLowerCase().includes(s);
      const okCat = !category || m.category === category;
      return okText && okCat;
    }) ?? [];

  const registrations = registrationsQuery.data ?? [];

  const slotsLeft = (missionId: string, capacity: number) => {
    const count = registrations.filter((r) => r.missionId === missionId).length;
    return Math.max(0, capacity - count);
  };

  return {
    ...missionsQuery,
    registrations,
    filtered,
    slotsLeft,
  };
}
