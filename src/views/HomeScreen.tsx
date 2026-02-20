import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useMissions } from "../hooks/useMissions";
import type { Mission, MissionCategory } from "../models/Mission";


const categories: { label: string; value: MissionCategory; icon: string }[] = [
  { label: "Nettoyage", value: "Nettoyage", icon: "water" },
  { label: "Plantation", value: "Plantation", icon: "flower" },
  { label: "Atelier", value: "Atelier", icon: "construct" },
  { label: "Sensibilisation", value: "Sensibilisation", icon: "megaphone" },
];

const categoryColors: Record<MissionCategory, { bg: string; text: string; dot: string; light: string }> = {
  Nettoyage: { bg: "#3b82f6", text: "#1d4ed8", dot: "#3b82f6", light: "#eff6ff" },
  Plantation: { bg: "#10b981", text: "#047857", dot: "#10b981", light: "#ecfdf5" },
  Atelier: { bg: "#f59e0b", text: "#b45309", dot: "#f59e0b", light: "#fffbeb" },
  Sensibilisation: { bg: "#ec4899", text: "#be185d", dot: "#ec4899", light: "#fdf2f8" },
};


function MissionCard({ mission, slotsLeft }: { mission: Mission; slotsLeft: number }) {
  const colors = categoryColors[mission.category];
  const progress = mission.capacity > 0
    ? ((mission.capacity - slotsLeft) / mission.capacity) * 100
    : 100;

  return (
    <Link
      href={{ pathname: "/mission/[id]", params: { id: mission.id } }}
      asChild
    >
      <Pressable
        style={({ pressed }) => ({
          marginBottom: 24,
          borderRadius: 32,
          backgroundColor: "#ffffff",
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.06,
          shadowRadius: 24,
          elevation: 6,
          transform: [{ scale: pressed ? 0.98 : 1 }],
          borderWidth: 1,
          borderColor: "#f3f4f6",
        })}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: mission.image }}
            style={{ width: "100%", height: 240 }}
            contentFit="cover"
            transition={800}
            cachePolicy="memory-disk"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.05)",
            }}
          />

          <View
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "rgba(255,255,255,0.9)",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              backdropFilter: "blur(10px)",
            } as any}
          >
            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.bg }} />
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#111827", letterSpacing: 0.2 }}>
              {mission.category.toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              backgroundColor: slotsLeft > 0 ? "#059669" : "#dc2626",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
            }}
          >
            <Ionicons name={slotsLeft > 0 ? "people" : "lock-closed"} size={14} color="#fff" />
            <Text style={{ fontSize: 12, fontWeight: "900", color: "#fff" }}>
              {slotsLeft > 0 ? `${slotsLeft} DISPO` : "COMPLET"}
            </Text>
          </View>
        </View>

        <View style={{ padding: 24 }}>
          <Text
            style={{ fontSize: 22, fontWeight: "900", color: "#111827", lineHeight: 30, letterSpacing: -0.2 }}
            numberOfLines={2}
          >
            {mission.title}
          </Text>

          <View style={{ marginTop: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#f9fafb", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#f3f4f6" }}>
                <Ionicons name="location" size={16} color="#4b5563" />
              </View>
              <Text style={{ fontSize: 15, color: "#4b5563", fontWeight: "600" }} numberOfLines={1}>
                {mission.location}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#f9fafb", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#f3f4f6" }}>
                <Ionicons name="calendar" size={16} color="#4b5563" />
              </View>
              <Text style={{ fontSize: 15, color: "#4b5563", fontWeight: "600" }}>
                {new Date(mission.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8, alignItems: "flex-end" }}>
              <Text style={{ fontSize: 12, fontWeight: "800", color: "#9ca3af", letterSpacing: 1 }}>ENGAGEMENT</Text>
              <Text style={{ fontSize: 14, fontWeight: "900", color: slotsLeft > 0 ? "#10b981" : "#ef4444" }}>
                {Math.round(progress)}%
              </Text>
            </View>
            <View style={{ height: 10, borderRadius: 5, backgroundColor: "#f3f4f6", overflow: "hidden" }}>
              <View
                style={{
                  height: "100%",
                  borderRadius: 5,
                  backgroundColor: slotsLeft > 0 ? "#10b981" : "#ef4444",
                  width: `${Math.min(progress, 100)}%`,
                  shadowColor: slotsLeft > 0 ? "#10b981" : "#ef4444",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                }}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<MissionCategory | undefined>(undefined);
  const { filtered, isLoading, isError, slotsLeft, refetch } = useMissions(search, cat);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          backgroundColor: "#111827",
          paddingTop: 64,
          paddingBottom: 32,
          paddingHorizontal: 24,
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 10,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View>
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", fontWeight: "700", letterSpacing: 1 }}>
              BONJOUR, {user?.name?.split(" ")[0].toUpperCase() ?? "AMI"} 👋
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 4 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(16, 185, 129, 0.2)",
                }}
              >
                <Ionicons name="leaf" size={26} color="#10b981" />
              </View>
              <Text style={{ fontSize: 34, fontWeight: "900", color: "#fff", letterSpacing: -1 }}>
                EcoAction
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0.06)",
            borderRadius: 24,
            paddingHorizontal: 20,
            marginTop: 32,
            height: 64,
            borderWidth: 1.5,
            borderColor: "#10b981",
          }}
        >
          <Ionicons name="search" size={22} color="rgba(255,255,255,0.4)" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Explorer des missions..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={{
              flex: 1,
              paddingHorizontal: 16,
              fontSize: 17,
              color: "#fff",
              fontWeight: "600",
            }}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={24} color="rgba(255,255,255,0.2)" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
        }
      >
        <View style={{ marginTop: 32, marginBottom: 24 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 14 }}
          >
            <Pressable
              onPress={() => setCat(undefined)}
              style={({ pressed }) => ({
                paddingHorizontal: 24,
                paddingVertical: 14,
                borderRadius: 20,
                backgroundColor: !cat ? "#10b981" : "#f3f4f6",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderWidth: 1,
                borderColor: !cat ? "#10b981" : "#e5e7eb",
                opacity: pressed ? 0.9 : 1,
                shadowColor: !cat ? "#10b981" : "transparent",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              })}
            >
              <Ionicons name="grid" size={18} color={!cat ? "#fff" : "#6b7280"} />
              <Text style={{ fontSize: 15, fontWeight: "800", color: !cat ? "#fff" : "#6b7280" }}>
                TOUTES
              </Text>
            </Pressable>
            {categories.map((c) => (
              <Pressable
                key={c.value}
                onPress={() => setCat(cat === c.value ? undefined : c.value)}
                style={({ pressed }) => ({
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 20,
                  backgroundColor: cat === c.value ? "#10b981" : "#f3f4f6",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderColor: cat === c.value ? "#10b981" : "#e5e7eb",
                  opacity: pressed ? 0.9 : 1,
                  shadowColor: cat === c.value ? "#10b981" : "transparent",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                })}
              >
                <Ionicons
                  name={c.icon as any}
                  size={18}
                  color={cat === c.value ? "#fff" : "#6b7280"}
                />
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: cat === c.value ? "#fff" : "#6b7280",
                  }}
                >
                  {c.label.toUpperCase()}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 24, paddingBottom: 100 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: "900", color: "#111827", letterSpacing: -0.5 }}>
                Missions disponibles
              </Text>
              <Text style={{ fontSize: 14, color: "#9ca3af", fontWeight: "600", marginTop: 4 }}>
                Explorez et trouvez votre impact
              </Text>
            </View>
            <View style={{ backgroundColor: "#ecfdf5", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ fontSize: 13, color: "#10b981", fontWeight: "800" }}>
                {filtered.length}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={{ gap: 20 }}>
              <View style={{ height: 300, backgroundColor: "#f3f4f6", borderRadius: 24 }} />
              <View style={{ height: 300, backgroundColor: "#f3f4f6", borderRadius: 24 }} />
            </View>
          ) : isError ? (
            <View style={{ paddingVertical: 40, alignItems: "center", gap: 16 }}>
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
              <Text style={{ color: "#374151", fontSize: 16, fontWeight: "600" }}>Oups! Problème de connexion</Text>
              <Pressable onPress={() => refetch()} style={{ backgroundColor: "#111827", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16 }}>
                <Text style={{ color: "#fff", fontWeight: "700" }}>Réessayer</Text>
              </Pressable>
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ paddingVertical: 60, alignItems: "center", gap: 12 }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#f9fafb", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="search" size={32} color="#d1d5db" />
              </View>
              <Text style={{ color: "#9ca3af", fontSize: 16, fontWeight: "600" }}>Aucun résultat</Text>
            </View>
          ) : (
            filtered.map((m) => (
              <MissionCard key={m.id} mission={m} slotsLeft={slotsLeft(m.id, m.capacity)} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
