
export enum Quadrant {
  DO = 'DO',             // Urgent & Important
  SCHEDULE = 'SCHEDULE', // Not Urgent & Important
  DELEGATE = 'DELEGATE', // Urgent & Not Important
  ELIMINATE = 'ELIMINATE' // Not Urgent & Not Important
}

export interface Task {
  id: string;
  user_id: string;
  text: string;
  quadrant: Quadrant;
  created_at: string;
  updated_at: string;
}

export interface UserConfig {
  user_id: string;
  uazapi_url: string;
  uazapi_token: string | null;
  uazapi_number: string;
  created_at: string;
  updated_at: string;
}

export interface EisenhowerState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
