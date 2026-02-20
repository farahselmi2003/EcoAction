import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { fetchRegistrations } from "../controllers/missionController";
import { fetchUser } from "../controllers/userController";


function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
  bgColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#f3f4f6",
      }}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 18,
          backgroundColor: bgColor,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={{ fontSize: 28, fontWeight: "900", color: "#111827" }}>{value}</Text>
      <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600", marginTop: 4, textAlign: "center" }}>
        {label}
      </Text>
    </View>
  );
}


export default function ProfileScreen() {
  const { user: authUser, logout } = useAuth();
  const userId = String(authUser?.id ?? "1");

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const { data: registrations } = useQuery({
    queryKey: ["registrations"],
    queryFn: fetchRegistrations,
  });

  const activeRegs = (registrations ?? []).filter((r) => r.userId === userId).length;

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <Text style={{ color: "#6b7280", fontWeight: "600" }}>Chargement du profil...</Text>
      </View>
    );
  }

  if (isError || !user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", gap: 16 }}>
        <Ionicons name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ color: "#111827", fontWeight: "800", fontSize: 18 }}>Oups ! Erreur de chargement</Text>
      </View>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "#111827",
            paddingTop: 80,
            paddingBottom: 60,
            paddingHorizontal: 24,
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            alignItems: "center",
          }}
        >
          {/* Avatar with Ring */}
          <View
            style={{
              padding: 4,
              borderRadius: 42,
              borderWidth: 2,
              borderColor: "rgba(255,255,255,0.2)",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 38,
                backgroundColor: "#3b82f6",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <Text style={{ fontSize: 36, fontWeight: "900", color: "#fff" }}>
                {initials}
              </Text>
            </View>
          </View>

          <Text style={{ fontSize: 28, fontWeight: "900", color: "#fff" }}>
            {user.name}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginTop: 12,
              backgroundColor: "rgba(255,255,255,0.08)",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <Ionicons name="mail" size={16} color="rgba(255,255,255,0.6)" />
            <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>
              {user.email}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 24, marginTop: -35 }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <StatCard
              icon="trophy"
              label="Missions complétées"
              value={user.stats.completedMissions}
              color="#10b981"
              bgColor="#ecfdf5"
            />
            <StatCard
              icon="calendar"
              label="Inscriptions"
              value={activeRegs}
              color="#3b82f6"
              bgColor="#eff6ff"
            />
          </View>
        </View>

        <View style={{ padding: 24 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827", marginBottom: 16, marginLeft: 4 }}>
            Détails du compte
          </Text>

          <View
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 28,
              padding: 12,
              borderWidth: 1,
              borderColor: "#f3f4f6",
            }}
          >
            {[
              { icon: "person", label: "Nom complet", value: user.name },
              { icon: "mail", label: "Adresse email", value: user.email },
              { icon: "finger-print", label: "ID Volontaire", value: `ECO-${String(user.id).padStart(4, "0")}` },
            ].map((item, idx, arr) => (
              <View key={item.label}>
                <View style={{ flexDirection: "row", alignItems: "center", padding: 16, gap: 16 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 16,
                      backgroundColor: "#fff",
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#f3f4f6",
                    }}
                  >
                    <Ionicons name={item.icon as any} size={20} color="#111827" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: "#9ca3af", fontWeight: "700", marginBottom: 2 }}>{item.label.toUpperCase()}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
                      {item.value}
                    </Text>
                  </View>
                </View>
                {idx < arr.length - 1 && (
                  <View style={{ height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 16 }} />
                )}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleLogout}
            style={{
              backgroundColor: "#fef2f2",
              borderRadius: 24,
              height: 64,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 24,
              borderWidth: 1,
              borderColor: "#fee2e2",
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontWeight: "900", fontSize: 16, letterSpacing: 0.5 }}>
              SE DÉCONNECTER
            </Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}
