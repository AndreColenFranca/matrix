import React from 'react';
import { Task, Quadrant } from '../types';
import TaskItem from './TaskItem';

interface EisenhowerMatrixProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, quadrant: Quadrant) => void;
  onUpdate: (id: string, newText: string) => void;
}

interface QuadrantBoxProps {
  title: string;
  subtitle: string;
  colorClass: string;
  icon: string;
  tasks: Task[];
  onDelete: (id: string) => void;
  onMove: (id: string, quadrant: Quadrant) => void;
  onUpdate: (id: string, newText: string) => void;
  currentQuadrant: Quadrant;
}

const QuadrantBox: React.FC<QuadrantBoxProps> = ({
  title,
  subtitle,
  colorClass,
  icon,
  tasks,
  onDelete,
  onMove,
  onUpdate,
  currentQuadrant,
}) => {
  const otherQuadrants = Object.values(Quadrant).filter((q) => q !== currentQuadrant);

  return (
    <div
      className={`flex flex-col h-full rounded-2xl border-2 p-4 min-h-[300px] transition-all ${colorClass}`}
    >
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
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              otherQuadrants={otherQuadrants}
              onDelete={onDelete}
              onMove={onMove}
              onUpdate={onUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
};

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  tasks,
  onDelete,
  onMove,
  onUpdate,
}) => {
  const getTasksByQuadrant = (q: Quadrant) => tasks.filter((t) => t.quadrant === q);

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
        onUpdate={onUpdate}
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
        onUpdate={onUpdate}
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
        onUpdate={onUpdate}
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
        onUpdate={onUpdate}
        currentQuadrant={Quadrant.ELIMINATE}
      />
    </div>
  );
};
