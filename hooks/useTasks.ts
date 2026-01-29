import { useEffect, useState, useCallback } from 'react';
import { Task, Quadrant } from '../types';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (text: string, quadrant: Quadrant) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  updateTask: (id: string, quadrant: Quadrant) => Promise<void>;
}

const STORAGE_KEY = 'eisenhower_tasks';

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTasks(Array.isArray(parsed) ? parsed : []);
      }
    } catch (err) {
      console.error('Error loading tasks from localStorage:', err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback((text: string, quadrant: Quadrant) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setError(null);

        const now = new Date().toISOString();
        const newTask: Task = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: 'local',
          text,
          quadrant,
          created_at: now,
          updated_at: now,
        };

        setTasks((prev) => {
          const updated = [newTask, ...prev];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });

        resolve();
      } catch (err: any) {
        console.error('Error adding task:', err);
        setError('Erro ao adicionar tarefa');
        reject(err);
      }
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setError(null);

        setTasks((prev) => {
          const updated = prev.filter((t) => t.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });

        resolve();
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setError('Erro ao remover tarefa');
        reject(err);
      }
    });
  }, []);

  const clearAllTasks = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      try {
        setError(null);

        setTasks([]);
        localStorage.removeItem(STORAGE_KEY);

        resolve();
      } catch (err: any) {
        console.error('Error clearing tasks:', err);
        setError('Erro ao limpar tarefas');
        reject(err);
      }
    });
  }, []);

  const updateTask = useCallback((id: string, quadrant: Quadrant) => {
    return new Promise<void>((resolve, reject) => {
      try {
        setError(null);

        const now = new Date().toISOString();
        setTasks((prev) => {
          const updated = prev.map((t) =>
            t.id === id ? { ...t, quadrant, updated_at: now } : t
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });

        resolve();
      } catch (err: any) {
        console.error('Error updating task:', err);
        setError('Erro ao mover tarefa');
        reject(err);
      }
    });
  }, []);

  return {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    clearAllTasks,
    updateTask,
  };
};
