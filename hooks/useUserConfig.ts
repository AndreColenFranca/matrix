import { useEffect, useState, useCallback } from 'react';
import { UserConfig } from '../types';

const DEFAULT_CONFIG: Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'> = {
  uazapi_url: 'https://free.uazapi.com/send/text',
  uazapi_token: null,
  uazapi_number: '5531994718445',
};

const STORAGE_KEY = 'eisenhower_user_config';

interface UseUserConfigResult {
  config: Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>;
  loading: boolean;
  error: string | null;
  updateConfig: (
    newConfig: Partial<Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>>
  ) => void;
}

export const useUserConfig = (): UseUserConfigResult => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load config from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig(parsed);
      }
    } catch (err) {
      console.error('Error loading config from localStorage:', err);
      setConfig(DEFAULT_CONFIG);
    }
  }, []);

  const updateConfig = useCallback(
    (newConfig: Partial<Omit<UserConfig, 'user_id' | 'created_at' | 'updated_at'>>) => {
      try {
        setError(null);
        const updatedConfig = { ...config, ...newConfig };
        setConfig(updatedConfig);

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedConfig));
      } catch (err: any) {
        console.error('Error updating config:', err);
        setError('Erro ao salvar configurações');
      }
    },
    [config]
  );

  return {
    config,
    loading,
    error,
    updateConfig,
  };
};
