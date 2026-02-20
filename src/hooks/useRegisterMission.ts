import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerMission, unregisterMission } from "../controllers/missionController";
import type { Registration } from "../types/api.types";
export function useRegisterMission(userId: string) {
  const qc = useQueryClient();
  const regKey = ["registrations"];
  const register = useMutation({
    mutationKey: ["register", userId],
    mutationFn: (missionId: string) => registerMission(userId, missionId),
    onMutate: async (missionId) => {
      await qc.cancelQueries({ queryKey: regKey });
      const prev = qc.getQueryData<Registration[]>(regKey) ?? [];
      qc.setQueryData<Registration[]>(regKey, [
        ...prev,
        { id: String(Date.now()), userId, missionId },
      ]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(regKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: regKey });
    },
  });
  const unregister = useMutation({
    mutationKey: ["unregister", userId],
    mutationFn: (registrationId: string) => unregisterMission(registrationId),
    onMutate: async (registrationId) => {
      await qc.cancelQueries({ queryKey: regKey });
      const prev = qc.getQueryData<Registration[]>(regKey) ?? [];
      qc.setQueryData<Registration[]>(
        regKey,
        prev.filter((r) => r.id !== registrationId)
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(regKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: regKey });
    },
  });
  const registrations = () => qc.getQueryData<Registration[]>(regKey) ?? [];
  return { register, unregister, registrations };
}
                                            