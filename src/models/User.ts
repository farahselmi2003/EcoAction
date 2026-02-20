export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  stats: {
    completedMissions: number;
  };
}
