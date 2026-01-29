export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          text: string;
          quadrant: 'DO' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          text: string;
          quadrant: 'DO' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          text?: string;
          quadrant?: 'DO' | 'SCHEDULE' | 'DELEGATE' | 'ELIMINATE';
          created_at?: string;
          updated_at?: string;
        };
      };
      user_config: {
        Row: {
          user_id: string;
          uazapi_url: string;
          uazapi_token: string | null;
          uazapi_number: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          uazapi_url?: string;
          uazapi_token?: string | null;
          uazapi_number?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          uazapi_url?: string;
          uazapi_token?: string | null;
          uazapi_number?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
