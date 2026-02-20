import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { fetchMission, fetchRegistrations } from "../controllers/missionController";
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


export default function MissionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const missionId = id as string;
  const userId = String(user?.id ?? "1");

  const {
    data: mission,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mission", missionId],
    queryFn: () => fetchMission(missionId),
  });

  const { data: registrations } = useQuery({
    queryKey: ["registrations"],
    queryFn: fetchRegistrations,
  });

  const { register, unregister } = useRegisterMission(userId);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb" }}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={{ marginTop: 12, color: "#6b7280" }}>Chargement de la mission...</Text>
      </View>
    );
  }

  if (isError || !mission) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", gap: 12 }}>
        <Ionicons name="alert-circle" size={48} color="#dc2626" />
        <Text style={{ color: "#dc2626", fontSize: 16, fontWeight: "600" }}>
          Impossible de charger la mission
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{ backgroundColor: "#059669", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 8 }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Retour</Text>
        </Pressable>
      </View>
    );
  }

  const style = catStyle[mission.category] ?? catStyle.Nettoyage;
  const icon = catIcons[mission.category] ?? "leaf";
  const regs = registrations?.filter((r) => r.missionId === missionId) ?? [];
  const myReg = regs.find((r) => r.userId === userId);
  const slotsLeft = Math.max(0, mission.capacity - regs.length);
  const progress = mission.capacity > 0 ? ((mission.capacity - slotsLeft) / mission.capacity) * 100 : 100;

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: mission.image }}
            style={{ width: "100%", height: 350 }}
            contentFit="cover"
            transition={500}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          />

          {/* Floating Header */}
          <View style={{ position: "absolute", top: 50, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" }}>
            <Pressable
              onPress={() => router.back()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <View
              style={{
                paddingHorizontal: 16,
                height: 48,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.3)",
              }}
            >
              <Ionicons name={icon as any} size={18} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
                {mission.category.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Title & Stats Gradient Bottom */}
          <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, paddingTop: 60, backgroundColor: "rgba(0,0,0,0.4)" }}>
            <Text style={{ fontSize: 32, fontWeight: "900", color: "#fff", letterSpacing: -0.5 }}>
              {mission.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 12 }}>
              <View style={{ backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>
                  {slotsLeft} PLACES LIBRES
                </Text>
              </View>
              <View style={{ height: 4, width: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.5)" }} />
              <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>
                {mission.location}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 24 }}>
          {/* Info Grid */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1, backgroundColor: "#f9fafb", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#f3f4f6" }}>
              <Ionicons name="calendar-outline" size={20} color="#111827" />
              <Text style={{ fontSize: 13, color: "#9ca3af", fontWeight: "600", marginTop: 8 }}>DATE</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#111827", marginTop: 2 }}>
                {new Date(mission.date).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#f9fafb", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#f3f4f6" }}>
              <Ionicons name="time-outline" size={20} color="#111827" />
              <Text style={{ fontSize: 13, color: "#9ca3af", fontWeight: "600", marginTop: 8 }}>HEURE</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#111827", marginTop: 2 }}>
                {new Date(mission.date).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
            <View style={{ flex: 1, backgroundColor: "#f9fafb", borderRadius: 20, padding: 16, borderWidth: 1, borderColor: "#f3f4f6" }}>
              <Ionicons name="people-outline" size={20} color="#111827" />
              <Text style={{ fontSize: 13, color: "#9ca3af", fontWeight: "600", marginTop: 8 }}>CAPACITÉ</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#111827", marginTop: 2 }}>
                {mission.capacity} max
              </Text>
            </View>
          </View>

          {/* Progress Bar View */}
          <View style={{ backgroundColor: "#f9fafb", borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: "#f3f4f6" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: "800", color: "#111827" }}>Taux de participation</Text>
              <Text style={{ fontSize: 14, fontWeight: "900", color: style.bg }}>{Math.round(progress)}%</Text>
            </View>
            <View style={{ height: 10, borderRadius: 5, backgroundColor: "#e5e7eb" }}>
              <View style={{ height: 10, borderRadius: 5, backgroundColor: style.bg, width: `${Math.min(progress, 100)}%` }} />
            </View>
            <Text style={{ fontSize: 13, color: "#6b7280", marginTop: 12, lineHeight: 18 }}>
              Rejoignez les {regs.length} volontaires déjà inscrits pour cette mission.
            </Text>
          </View>

          {/* Description */}
          <View>
            <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827", marginBottom: 12 }}>À propos de la mission</Text>
            <Text style={{ fontSize: 16, color: "#4b5563", lineHeight: 26 }}>
              {mission.description}
            </Text>
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', bottom: 40, left: 24, right: 24 }}>
        {myReg ? (
          <Pressable
            onPress={() => unregister.mutate(myReg.id)}
            style={{
              backgroundColor: "#fef2f2",
              borderRadius: 20,
              height: 64,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#ef4444",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "800", fontSize: 16 }}>ANNULER L{"'"}INSCRIPTION</Text>
          </Pressable>
        ) : (
          <Pressable
            disabled={slotsLeft <= 0}
            onPress={() => register.mutate(mission.id)}
            style={{
              backgroundColor: slotsLeft > 0 ? "#111827" : "#d1d5db",
              borderRadius: 20,
              height: 64,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.2,
              shadowRadius: 20,
              elevation: 8,
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Ionicons name={slotsLeft > 0 ? "chevron-forward-circle" : "lock-closed"} size={24} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              {slotsLeft > 0 ? "M'INSCRIRE MAINTENANT" : "MISSION COMPLÈTE"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
