import React, { useState } from 'react';

interface ActivityInputProps {
  onAdd: (activity: string) => void;
  isLoading: boolean;
}

export const ActivityInput: React.FC<ActivityInputProps> = ({ onAdd, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 w-full max-w-xl flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ex: Enviar relatório trimestral..."
          disabled={isLoading}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <i className="fas fa-magic text-indigo-400 animate-pulse"></i>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap"
      >
        {isLoading ? 'Analisando...' : 'Classificar'}
      </button>
    </form>
  );
};
