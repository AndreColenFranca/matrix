import React, { FC, useState, useRef, useEffect } from 'react';
import { Task, Quadrant } from '../types';

interface TaskItemProps {
  task: Task;
  otherQuadrants: Quadrant[];
  onDelete: (id: string) => void;
  onMove: (id: string, quadrant: Quadrant) => void;
  onUpdate: (id: string, newText: string) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task, otherQuadrants, onDelete, onMove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      // Select all text for easier replacement
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== task.text) {
      onUpdate(task.id, trimmedText);
    }
    setIsEditing(false);
    setEditText(task.text); // Reset to original if not saved
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(task.text); // Reset to original
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleBlur = () => {
    // Cancel edit when clicking outside
    handleCancel();
  };

  const isSaveDisabled = !editText.trim() || editText.trim() === task.text;

  return (
    <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-start group animate-in slide-in-from-top-2 duration-300 relative">
      {isEditing ? (
        <div className="flex-1 flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Digite o novo texto..."
            className="px-2 py-1 flex-1 border border-indigo-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className={`p-1 rounded transition-colors ${
              isSaveDisabled
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
            }`}
            title="Salvar (Enter)"
            aria-label="Salvar alterações"
          >
            <i className="fas fa-check text-xs"></i>
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
            title="Cancelar (Escape)"
            aria-label="Cancelar edição"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>
      ) : (
        <>
          <span
            className="text-sm font-medium text-slate-800 leading-tight flex-1 cursor-pointer hover:text-indigo-600 transition-colors"
            onClick={() => setIsEditing(true)}
            title="Clique para editar"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsEditing(true);
              }
            }}
          >
            {task.text}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsEditing(true)}
              className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
              title="Editar tarefa"
              aria-label={`Editar: ${task.text}`}
            >
              <i className="fas fa-edit text-xs"></i>
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMoveMenu(!showMoveMenu)}
                className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
                title="Mover para outro quadrante"
                aria-label="Mover tarefa"
              >
                <i className="fas fa-arrow-right text-xs"></i>
              </button>
              {showMoveMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-[140px]">
                  {otherQuadrants.map((quadrant) => (
                    <button
                      key={quadrant}
                      onClick={() => {
                        onMove(task.id, quadrant);
                        setShowMoveMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 transition-colors first:rounded-t-lg last:rounded-b-lg text-slate-700 font-medium"
                    >
                      {quadrant === Quadrant.DO && '🔥 Fazer'}
                      {quadrant === Quadrant.SCHEDULE && '📅 Agendar'}
                      {quadrant === Quadrant.DELEGATE && '👤 Delegar'}
                      {quadrant === Quadrant.ELIMINATE && '🗑️ Eliminar'}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
              title="Excluir tarefa"
              aria-label={`Excluir: ${task.text}`}
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
