import { router } from "expo-router";
import { createContext, useContext, useMemo, useReducer } from "react";
export type ActionItem = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  points: number;
  completed: boolean;
  date: string;
};
type State = {
  actions: ActionItem[];
};
type AddPayload = Omit<ActionItem, "id" | "completed" | "date">;
type Actions =
  | { type: "add"; payload: AddPayload }
  | { type: "toggle"; id: string }
  | { type: "remove"; id: string };
const initial: State = {
  actions: [
    {
      id: "a1",
      title: "Réduire l’utilisation de plastique",
      description: "Utiliser une gourde et des sacs réutilisables",
      category: "Consommation",
      points: 20,
      completed: false,
      date: new Date().toISOString(),
    },
    {
      id: "a2",
      title: "Prendre les transports en commun",
      description: "Remplacer la voiture par le tram",
      category: "Mobilité",
      points: 15,
      completed: true,
      date: new Date().toISOString(),
    },
  ],
};
function reducer(state: State, action: Actions): State {
  if (action.type === "add") {
    const item: ActionItem = {
      id: Math.random().toString(36).slice(2) + Date.now().toString(36),
      title: action.payload.title,
      description: action.payload.description,
      category: action.payload.category,
      points: Math.max(0, Math.round(action.payload.points)),
      completed: false,
      date: new Date().toISOString(),
    };
    return { actions: [item, ...state.actions] };
  }
  if (action.type === "toggle") {
    return {
      actions: state.actions.map((it) =>
        it.id === action.id ? { ...it, completed: !it.completed } : it
      ),
    };
  }
  if (action.type === "remove") {
    return { actions: state.actions.filter((it) => it.id !== action.id) };
  }
  return state;
}
const Ctx = createContext<{
  state: State;
  addAction: (payload: AddPayload) => void;
  toggleAction: (id: string) => void;
  removeAction: (id: string) => void;
} | null>(null);
export function ActionsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(
    () => ({
      state,
      addAction: (payload: AddPayload) => {
        dispatch({ type: "add", payload });
        router.back();
      },
      toggleAction: (id: string) => dispatch({ type: "toggle", id }),
      removeAction: (id: string) => dispatch({ type: "remove", id }),
    }),
    [state]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useActions() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("ActionsProvider manquant");
  }
  return ctx;
}
