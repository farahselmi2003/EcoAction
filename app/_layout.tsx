import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider, focusManager } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import "./global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: true,
    },
    mutations: { retry: 1 },
  },
});

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "login";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/login" as any);
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)" as any);
    }
  }, [isAuthenticated, isLoading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web" && typeof window === "undefined") return;

    const persister = createAsyncStoragePersister({
      storage: AsyncStorage,
      key: "ecoaction-query-cache",
    });

    persistQueryClient({
      queryClient,
      persister,
      maxAge: 1000 * 60 * 60,
    });

    const sub = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => sub.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </QueryClientProvider>
  );
}
