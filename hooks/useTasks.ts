import { useEffect, useState, useCallback } from 'react';
import { Task, Quadrant } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (text: string, quadrant: Quadrant) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  updateTask: (id: string, quadrant: Quadrant) => Promise<void>;
  updateTaskText: (id: string, newText: string) => Promise<void>;
}

export const useTasks = (): UseTasksResult => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch tasks on mount and when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id as string)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setTasks(data || []);
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError('Erro ao carregar tarefas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`tasks-${user.id as string}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id as string}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [payload.new as Task, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) =>
              prev.map((t) => (t.id === payload.new.id ? (payload.new as Task) : t))
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

  const addTask = useCallback(
    async (text: string, quadrant: Quadrant) => {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      try {
        setError(null);

        const taskData = {
          user_id: user.id as string,
          text,
          quadrant,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // @ts-expect-error - Supabase type inference issue with Insert type
        const { error: insertError } = await supabase.from('tasks').insert([taskData]);

        if (insertError) throw insertError;
      } catch (err: any) {
        console.error('Error adding task:', err);
        setError('Erro ao adicionar tarefa');
        throw err;
      }
    },
    [user]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      try {
        setError(null);

        // Remove imediatamente da tela (otimistic update)
        setTasks((prev) => prev.filter((t) => t.id !== id));

        const { error: deleteError } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id as string);

        if (deleteError) throw deleteError;
      } catch (err: any) {
        console.error('Error deleting task:', err);
        setError('Erro ao remover tarefa');
        throw err;
      }
    },
    [user]
  );

  const clearAllTasks = useCallback(async () => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id as string);

      if (deleteError) throw deleteError;
    } catch (err: any) {
      console.error('Error clearing tasks:', err);
      setError('Erro ao limpar tarefas');
      throw err;
    }
  }, [user]);

  const updateTask = useCallback(
    async (id: string, quadrant: Quadrant) => {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      try {
        setError(null);

        // Atualiza imediatamente na tela
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, quadrant, updated_at: new Date().toISOString() } : t
          )
        );

        const updateData = {
          quadrant,
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('tasks')
          // @ts-expect-error - Supabase type inference issue with Update type
          .update(updateData as any)
          .eq('id', id)
          .eq('user_id', user.id as string);

        if (updateError) throw updateError;
      } catch (err: any) {
        console.error('Error updating task:', err);
        setError('Erro ao mover tarefa');
        throw err;
      }
    },
    [user]
  );

  const updateTaskText = useCallback(
    async (id: string, newText: string) => {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      if (!newText.trim()) {
        setError('Texto da tarefa não pode estar vazio');
        return;
      }

      try {
        setError(null);

        // Atualiza imediatamente na tela (optimistic update)
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, text: newText.trim(), updated_at: new Date().toISOString() } : t
          )
        );

        const updateData = {
          text: newText.trim(),
          updated_at: new Date().toISOString(),
        };

        const { error: updateError } = await supabase
          .from('tasks')
          // @ts-expect-error - Supabase type inference issue with Update type
          .update(updateData as any)
          .eq('id', id)
          .eq('user_id', user.id as string);

        if (updateError) throw updateError;
      } catch (err: any) {
        console.error('Error updating task text:', err);
        setError('Erro ao editar tarefa');
        throw err;
      }
    },
    [user]
  );

  return {
    tasks,
    loading,
    error,
    addTask,
    deleteTask,
    clearAllTasks,
    updateTask,
    updateTaskText,
  };
};
