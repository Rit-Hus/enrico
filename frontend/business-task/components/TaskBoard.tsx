import React from 'react';
import { CheckCircle2, Circle, Clock, Trash2, Layers } from 'lucide-react';
import { Task, TaskPriority, TaskType } from '../types';

interface TaskBoardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, setTasks }) => {
  
  const toggleStatus = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } 
        : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.HIGH: return 'text-red-600 bg-red-50 border-red-200';
      case TaskPriority.MEDIUM: return 'text-amber-600 bg-amber-50 border-amber-200';
      case TaskPriority.LOW: return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getTypeLabel = (t: TaskType) => {
    switch (t) {
      case TaskType.ACQUISITION: return 'Acquisition';
      case TaskType.VALIDATION: return 'Validation';
      case TaskType.CONVERSION: return 'Conversion';
      case TaskType.ADMIN: return 'Admin';
      case TaskType.PRODUCT: return 'Product';
      default: return 'General';
    }
  };

  const todoTasks = tasks.filter(t => t.status !== 'done');
  const doneTasks = tasks.filter(t => t.status === 'done');

  // Group Todo tasks by Theme if available
  const groupedTasks = todoTasks.reduce((acc, task) => {
    const theme = task.theme || 'General Tasks';
    if (!acc[theme]) acc[theme] = [];
    acc[theme].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="h-full overflow-y-auto pr-2 pb-10">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">My Action Plan</h2>
        <p className="text-sm text-slate-500">Focus on these tasks to move to the next business stage.</p>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No tasks yet</p>
          <p className="text-slate-400 text-sm mt-1">Chat with the AI to generate your plan.</p>
        </div>
      )}

      {/* Todo Section Grouped by Theme */}
      {Object.entries(groupedTasks).map(([theme, themeTasks]) => (
        <div key={theme} className="mb-8">
           {theme !== 'General Tasks' && (
             <div className="flex items-center gap-2 mb-3 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg inline-flex">
               <Layers className="w-4 h-4" />
               <span className="text-sm font-bold uppercase tracking-wide">{theme}</span>
             </div>
           )}
           
           <div className="space-y-3">
            {themeTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleStatus(task.id)} className="mt-1 text-slate-400 hover:text-indigo-600 transition-colors">
                    <Circle className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-slate-900 leading-tight">{task.title}</h4>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                    
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                        {getTypeLabel(task.type)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
           </div>
        </div>
      ))}

      {/* Done Section */}
      {doneTasks.length > 0 && (
        <div className="space-y-3 opacity-60 mt-8">
           <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Completed</h3>
           {doneTasks.map(task => (
            <div key={task.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex items-start gap-3">
                <button onClick={() => toggleStatus(task.id)} className="mt-1 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-500 line-through leading-tight">{task.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};