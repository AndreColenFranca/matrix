import { useEffect, useState, useCallback } from 'react';
import { UserConfig } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_CONFIG: Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'> = {
  uazapi_url: 'https://free.uazapi.com/send/text',
  uazapi_token: null,
  uazapi_number: '5531994718445',
};

interface UseUserConfigResult {
  config: Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>;
  loading: boolean;
  error: string | null;
  updateConfig: (
    newConfig: Partial<Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>>
  ) => Promise<void>;
}

export const useUserConfig = (): UseUserConfigResult => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch config on mount and when user changes
  useEffect(() => {
    if (!user) {
      setConfig(DEFAULT_CONFIG);
      setLoading(false);
      return;
    }

    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('user_config')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          // PGRST116 = no rows returned, which is fine for first-time users
          throw fetchError;
        }

        if (data && typeof data === 'object') {
          setConfig({
            uazapi_url: (data as Record<string, any>).uazapi_url || DEFAULT_CONFIG.uazapi_url,
            uazapi_token: (data as Record<string, any>).uazapi_token || null,
            uazapi_number:
              (data as Record<string, any>).uazapi_number || DEFAULT_CONFIG.uazapi_number,
          });
        } else {
          setConfig(DEFAULT_CONFIG);
        }
      } catch (err: any) {
        console.error('Error fetching config:', err);
        setError('Erro ao carregar configurações');
        setConfig(DEFAULT_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [user]);

  const updateConfig = useCallback(
    async (newConfig: Partial<Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>>) => {
      if (!user) {
        setError('Usuário não autenticado');
        return;
      }

      try {
        setError(null);

        const updatedConfig = { ...config, ...newConfig };

        // Try to update first, if no rows, insert
        const { data: existingData, error: selectError } = await supabase
          .from('user_config')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (existingData) {
          // Update existing
          const updateData = {
            uazapi_url: updatedConfig.uazapi_url,
            uazapi_token: updatedConfig.uazapi_token,
            uazapi_number: updatedConfig.uazapi_number,
            updated_at: new Date().toISOString(),
          };

          const { error: updateError } = await (supabase
            .from('user_config')
            .update(updateData)
            .eq('user_id', user.id) as any);

          if (updateError) throw updateError;
        } else {
          // Insert new
          const insertData = {
            user_id: user.id,
            uazapi_url: updatedConfig.uazapi_url,
            uazapi_token: updatedConfig.uazapi_token,
            uazapi_number: updatedConfig.uazapi_number,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const query: any = supabase.from('user_config').insert([insertData]);
          const { error: insertError } = await query;

          if (insertError) throw insertError;
        }

        setConfig(updatedConfig);
      } catch (err: any) {
        console.error('Error updating config:', err);
        setError('Erro ao salvar configurações');
        throw err;
      }
    },
    [user, config]
  );

  return {
    config,
    loading,
    error,
    updateConfig,
  };
};
