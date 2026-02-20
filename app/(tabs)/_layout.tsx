import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#059669",
                tabBarInactiveTintColor: "#9ca3af",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 0,
                    elevation: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    height: Platform.OS === "ios" ? 88 : 65,
                    paddingBottom: Platform.OS === "ios" ? 28 : 10,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Explorer",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="compass" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="my-missions"
                options={{
                    title: "Mes Missions",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="calendar" size={size} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="person" size={size} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
