
import React from 'react';
import { Task, Quadrant } from '../types';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, quadrant: Quadrant) => void;
}

interface QuadrantBoxProps {
  title: string;
  subtitle: string;
  colorClass: string;
  icon: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, quadrant: Quadrant) => void;
  currentQuadrant: Quadrant;
}

const QuadrantBox: React.FC<QuadrantBoxProps> = ({ title, subtitle, colorClass, icon, tasks, onDelete, onMove, currentQuadrant }) => {
  const [showMoveMenu, setShowMoveMenu] = React.useState<string | null>(null);

  const otherQuadrants = Object.values(Quadrant).filter(q => q !== currentQuadrant);

  return (
    <div className={`flex flex-col h-full rounded-2xl border-2 p-4 min-h-[300px] transition-all ${colorClass}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className={`${icon}`}></i>
            {title}
          </h3>
          <p className="text-xs opacity-75 font-medium uppercase tracking-wider">{subtitle}</p>
        </div>
        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="h-full flex items-center justify-center opacity-40 italic text-sm border-2 border-dashed border-current/20 rounded-xl">
            Nenhuma atividade
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className="bg-white/90 p-3 rounded-lg shadow-sm border border-slate-100 flex justify-between items-start group animate-in slide-in-from-top-2 duration-300 relative"
            >
              <span className="text-sm font-medium text-slate-800 leading-tight flex-1">{task.text}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="relative">
                  <button
                    onClick={() => setShowMoveMenu(showMoveMenu === task.id ? null : task.id)}
                    className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
                    title="Mover para outro quadrante"
                  >
                    <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                  {showMoveMenu === task.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 z-50 min-w-[140px]">
                      {otherQuadrants.map(quadrant => (
                        <button
                          key={quadrant}
                          onClick={() => {
                            onMove(task.id, quadrant);
                            setShowMoveMenu(null);
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
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks, onDelete, onMove }) => {
  const getTasksByQuadrant = (q: Quadrant) => tasks.filter(t => t.quadrant === q);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Quadrant 1: DO */}
      <QuadrantBox
        title="Fazer Agora"
        subtitle="Urgente & Importante"
        colorClass="bg-red-50 border-red-200 text-red-700"
        icon="fas fa-fire"
        tasks={getTasksByQuadrant(Quadrant.DO)}
        onDelete={onDelete}
        onMove={onMove}
        currentQuadrant={Quadrant.DO}
      />

      {/* Quadrant 2: SCHEDULE */}
      <QuadrantBox
        title="Agendar"
        subtitle="Não Urgente & Importante"
        colorClass="bg-blue-50 border-blue-200 text-blue-700"
        icon="fas fa-calendar-alt"
        tasks={getTasksByQuadrant(Quadrant.SCHEDULE)}
        onDelete={onDelete}
        onMove={onMove}
        currentQuadrant={Quadrant.SCHEDULE}
      />

      {/* Quadrant 3: DELEGATE */}
      <QuadrantBox
        title="Delegar"
        subtitle="Urgente & Não Importante"
        colorClass="bg-amber-50 border-amber-200 text-amber-700"
        icon="fas fa-users"
        tasks={getTasksByQuadrant(Quadrant.DELEGATE)}
        onDelete={onDelete}
        onMove={onMove}
        currentQuadrant={Quadrant.DELEGATE}
      />

      {/* Quadrant 4: ELIMINATE */}
      <QuadrantBox
        title="Eliminar"
        subtitle="Não Urgente & Não Importante"
        colorClass="bg-slate-100 border-slate-200 text-slate-500"
        icon="fas fa-trash-alt"
        tasks={getTasksByQuadrant(Quadrant.ELIMINATE)}
        onDelete={onDelete}
        onMove={onMove}
        currentQuadrant={Quadrant.ELIMINATE}
      />
    </div>
  );
};
