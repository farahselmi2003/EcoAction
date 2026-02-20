import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";


export default function LoginScreen() {
  const { login, register: registerUser } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = isRegister
    ? name.trim().length >= 2 && email.includes("@") && password.length >= 4
    : email.includes("@") && password.length >= 4;

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      let ok: boolean;
      if (isRegister) {
        ok = await registerUser(name.trim(), email.trim(), password);
        if (!ok) setError("Cet email est déjà utilisé.");
      } else {
        ok = await login(email.trim(), password);
        if (!ok) setError("Email ou mot de passe incorrect.");
      }
      if (ok) router.replace("/(tabs)" as any);
    } catch {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 30,
                backgroundColor: "rgba(255,255,255,0.08)",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <Ionicons name="leaf" size={44} color="#10b981" />
            </View>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#fff",
                textAlign: "center",
                letterSpacing: -1,
              }}
            >
              EcoAction
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#9ca3af",
                textAlign: "center",
                marginTop: 10,
                lineHeight: 22,
                maxWidth: 280,
              }}
            >
              {isRegister
                ? "Rejoignez le mouvement et agissez pour la planète dès aujourd'hui."
                : "Connectez-vous pour continuer vos actions pour un monde meilleur."}
            </Text>
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 40, gap: 24 }}>
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#f3f4f6",
                borderRadius: 20,
                padding: 6,
              }}
            >
              <Pressable
                onPress={() => {
                  setIsRegister(false);
                  setError("");
                }}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: !isRegister ? "#ffffff" : "transparent",
                  alignItems: "center",
                  shadowColor: !isRegister ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: !isRegister ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontWeight: "800",
                    color: !isRegister ? "#111827" : "#6b7280",
                    fontSize: 14,
                  }}
                >
                  CONNEXION
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsRegister(true);
                  setError("");
                }}
                style={{
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 16,
                  backgroundColor: isRegister ? "#ffffff" : "transparent",
                  alignItems: "center",
                  shadowColor: isRegister ? "#000" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: isRegister ? 2 : 0,
                }}
              >
                <Text
                  style={{
                    fontWeight: "800",
                    color: isRegister ? "#111827" : "#6b7280",
                    fontSize: 14,
                  }}
                >
                  INSCRIPTION
                </Text>
              </Pressable>
            </View>

            <View style={{ gap: 16 }}>
              {isRegister && (
                <View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 8, marginLeft: 4 }}>
                    NOM COMPLET
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#f9fafb",
                      borderRadius: 18,
                      paddingHorizontal: 16,
                      height: 60,
                      borderWidth: 1,
                      borderColor: "#f3f4f6",
                    }}
                  >
                    <Ionicons name="person-outline" size={20} color="#9ca3af" />
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Farah Selmi"
                      placeholderTextColor="#9ca3af"
                      style={{
                        flex: 1,
                        paddingHorizontal: 12,
                        fontSize: 16,
                        color: "#111827",
                        fontWeight: "600",
                      }}
                    />
                  </View>
                </View>
              )}

              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 8, marginLeft: 4 }}>
                  ADRESSE EMAIL
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 60,
                    borderWidth: 1,
                    borderColor: "#f3f4f6",
                  }}
                >
                  <Ionicons name="mail-outline" size={20} color="#9ca3af" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="votre@email.com"
                    placeholderTextColor="#9ca3af"
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      fontSize: 16,
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  />
                </View>
              </View>

              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#374151", marginBottom: 8, marginLeft: 4 }}>
                  MOT DE PASSE
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    height: 60,
                    borderWidth: 1,
                    borderColor: "#f3f4f6",
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor="#9ca3af"
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      fontSize: 16,
                      color: "#111827",
                      fontWeight: "600",
                    }}
                  />
                </View>
              </View>
            </View>

            {error ? (
              <View
                style={{
                  backgroundColor: "#fff1f2",
                  borderRadius: 16,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  borderWidth: 1,
                  borderColor: "#ffe4e6",
                }}
              >
                <Ionicons name="alert-circle" size={24} color="#e11d48" />
                <Text style={{ color: "#e11d48", fontSize: 14, fontWeight: "700", flex: 1 }}>
                  {error}
                </Text>
              </View>
            ) : null}

            <Pressable
              disabled={!canSubmit || loading}
              onPress={handleSubmit}
              style={({ pressed }) => ({
                backgroundColor: canSubmit ? "#111827" : "#d1d5db",
                borderRadius: 24,
                height: 64,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 12,
                marginTop: 8,
                opacity: pressed ? 0.9 : 1,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: canSubmit ? 0.2 : 0,
                shadowRadius: 20,
                elevation: canSubmit ? 8 : 0,
              })}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name={isRegister ? "rocket" : "arrow-forward-circle"}
                    size={24}
                    color="#fff"
                  />
                  <Text style={{ color: "#fff", fontWeight: "900", fontSize: 17, letterSpacing: 0.5 }}>
                    {isRegister ? "CRÉER MON COMPTE" : "SE CONNECTER"}
                  </Text>
                </>
              )}
            </Pressable>

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
