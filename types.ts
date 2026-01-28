
export enum Quadrant {
  DO = 'DO',             // Urgent & Important
  SCHEDULE = 'SCHEDULE', // Not Urgent & Important
  DELEGATE = 'DELEGATE', // Urgent & Not Important
  ELIMINATE = 'ELIMINATE' // Not Urgent & Not Important
}

export interface Task {
  id: string;
  text: string;
  quadrant: Quadrant;
  createdAt: number;
}

export interface EisenhowerState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
