export type MissionCategory =
  | "Nettoyage"
  | "Plantation"
  | "Atelier"
  | "Sensibilisation";

export interface Mission {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: MissionCategory;
  capacity: number;
  image: string;
}
