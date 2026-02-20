import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { User } from "../models/User";
import { api } from "../services/api";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "ecoaction-auth-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const user: User = JSON.parse(raw);
                    setState({ user, isAuthenticated: true, isLoading: false });
                } else {
                    setState((s) => ({ ...s, isLoading: false }));
                }
            } catch {
                setState((s) => ({ ...s, isLoading: false }));
            }
        })();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const users = await api.get<User[]>(`/users?email=${encodeURIComponent(email)}`);
            const found = users.find(
                (u) => u.email === email && u.password === password
            );
            if (!found) return false;
            const { password: _pw, ...safeUser } = found;
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
            setState({ user: safeUser as User, isAuthenticated: true, isLoading: false });
            return true;
        } catch {
            return false;
        }
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string) => {
            try {
                const existing = await api.get<User[]>(
                    `/users?email=${encodeURIComponent(email)}`
                );
                if (existing.length > 0) return false;
                const newUser = await api.post<User>("/users", {
                    name,
                    email,
                    password,
                    stats: { completedMissions: 0 },
                });
                const { password: _pw, ...safeUser } = newUser;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
                setState({ user: safeUser as User, isAuthenticated: true, isLoading: false });
                return true;
            } catch {
                return false;
            }
        },
        []
    );

    const logout = useCallback(async () => {
        await AsyncStorage.removeItem(STORAGE_KEY);
        setState({ user: null, isAuthenticated: false, isLoading: false });
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ ...state, login, register, logout }),
        [state, login, register, logout]
    );

    return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error("AuthProvider manquant");
    return ctx;
}
