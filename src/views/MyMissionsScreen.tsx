import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { fetchMissions, fetchRegistrations } from "../controllers/missionController";
import { useRegisterMission } from "../hooks/useRegisterMission";
import type { MissionCategory } from "../models/Mission";


const catStyle: Record<MissionCategory, { bg: string; accent: string; light: string; text: string }> = {
  Nettoyage: { bg: "#3b82f6", accent: "#2563eb", light: "#eff6ff", text: "#1d4ed8" },
  Plantation: { bg: "#10b981", accent: "#059669", light: "#ecfdf5", text: "#047857" },
  Atelier: { bg: "#f59e0b", accent: "#d97706", light: "#fffbeb", text: "#b45309" },
  Sensibilisation: { bg: "#ec4899", accent: "#db2777", light: "#fdf2f8", text: "#be185d" },
};

const catIcons: Record<MissionCategory, string> = {
  Nettoyage: "water",
  Plantation: "leaf",
  Atelier: "construct",
  Sensibilisation: "megaphone",
};

export default function MyMissionsScreen() {
  const { user } = useAuth();
  const userId = String(user?.id ?? "1");
  const [refreshing, setRefreshing] = useState(false);

  const { data: missions, refetch: refetchMissions } = useQuery({
    queryKey: ["missions"],
    queryFn: fetchMissions,
  });
  const { data: registrations, refetch: refetchRegs } = useQuery({
    queryKey: ["registrations"],
    queryFn: fetchRegistrations,
  });

  const { unregister } = useRegisterMission(userId);

  const mine = (registrations ?? []).filter((r) => r.userId === userId);
  const mineIds = new Set(mine.map((r) => r.missionId));
  const mineMissions = (missions ?? []).filter((m) => mineIds.has(m.id));

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMissions(), refetchRegs()]);
    setRefreshing(false);
  };

  const now = new Date();

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          backgroundColor: "#111827",
          paddingTop: 70,
          paddingBottom: 30,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 36,
          borderBottomRightRadius: 36,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "800", color: "#9ca3af", letterSpacing: 1.5, marginBottom: 8 }}>
          VOTRE ENGAGEMENT
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 32, fontWeight: "900", color: "#fff", letterSpacing: -1 }}>
            Mes Missions
          </Text>
          <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.1)", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="calendar" size={24} color="#fff" />
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#111827"
          />
        }
      >
        {mineMissions.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 80 }}>
            <View style={{ width: 80, height: 80, borderRadius: 32, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Ionicons name="leaf-outline" size={40} color="#9ca3af" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827", marginBottom: 8 }}>C{"'"}est bien calme ici...</Text>
            <Text style={{ fontSize: 15, color: "#6b7280", textAlign: "center", lineHeight: 22, maxWidth: 260, marginBottom: 28 }}>
              Vous n{"'"}avez pas encore de mission prévue. Découvrez les causes qui vous tiennent à cœur.
            </Text>
            <Link href={"/(tabs)" as any} asChild>
              <Pressable style={{ backgroundColor: "#111827", paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20 }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>EXPLORER LES MISSIONS</Text>
              </Pressable>
            </Link>
          </View>
        ) : (
          mineMissions.map((m) => {
            const isPast = new Date(m.date) < now;
            const reg = mine.find((r) => r.missionId === m.id);
            const style = catStyle[m.category] ?? catStyle.Nettoyage;
            const icon = catIcons[m.category] ?? "leaf";

            return (
              <View
                key={m.id}
                style={{
                  marginBottom: 20,
                  borderRadius: 28,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: "#f3f4f6",
                  overflow: "hidden",
                  opacity: isPast ? 0.6 : 1,
                }}
              >
                <View style={{ height: 130, position: "relative" }}>
                  <Image
                    source={{ uri: m.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: isPast ? "rgba(0,0,0,0.6)" : "#10b981", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>
                      {isPast ? "TERMINÉE" : "À VENIR"}
                    </Text>
                  </View>
                  <View style={{ position: "absolute", bottom: 12, right: 12, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Ionicons name={icon as any} size={14} color={style.bg} />
                    <Text style={{ fontSize: 11, fontWeight: "800", color: "#111827" }}>{m.category.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 19, fontWeight: "900", color: "#111827", marginBottom: 12 }}>{m.title}</Text>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                      <Text style={{ fontSize: 14, color: "#6b7280", fontWeight: "600" }}>
                        {new Date(m.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#d1d5db" }} />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Ionicons name="location-outline" size={16} color="#6b7280" />
                      <Text style={{ fontSize: 14, color: "#6b7280", fontWeight: "600" }}>{m.location}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <Link href={{ pathname: "/mission/[id]", params: { id: m.id } }} asChild>
                      <Pressable style={{ flex: 1, backgroundColor: "#f9fafb", borderColor: "#f3f4f6", borderWidth: 1, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }}>
                        <Ionicons name="eye-outline" size={18} color="#111827" />
                        <Text style={{ fontWeight: "800", color: "#111827", fontSize: 13 }}>VOIR DÉTAILS</Text>
                      </Pressable>
                    </Link>
                    {reg && !isPast && (
                      <Pressable
                        onPress={() => unregister.mutate(reg.id)}
                        style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: "#fef2f2", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#fee2e2" }}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                      </Pressable>
                    )}
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
